import { Proof, ResponseMetadata } from '../../proto/generated/platform.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import { Network } from '../../types.js'
import { PLATFORM_QUORUM_TYPES } from '../constants.js'
import verifyTenderdashProof from './verifyTenderdashProof.js'
import bytesToHex from './bytesToHex.js'
import { platformExplorerQuorumKeyProvider } from './platformExplorerQuorumKeyProvider.js'
import {
  ProofSignatureError,
  QuorumKeyUnavailableError,
  StaleResponseError,
  UnexpectedQuorumTypeError
} from './proofVerificationErrors.js'

const QUORUM_PUBLIC_KEY_LENGTH = 48
const QUORUM_KEY_CACHE_LIMIT = 64
const MAX_CLOCK_SKEW_MS = 2 * 60 * 1000
const DEFAULT_MAX_RESPONSE_AGE_MS = 15 * 60 * 1000

export interface QuorumKeyRequest {
  network: Network
  quorumType: number
  /** 32 bytes, exactly as in proof.quorumHash. Its hex encoding matches quorum hash in Dash Core RPC (`quorum info`) **/
  quorumHash: Uint8Array
  /** metadata.coreChainLockedHeight of the response being verified **/
  coreChainLockedHeight: number
  /** metadata.height of the response being verified **/
  platformHeight: bigint
  /** 'signature-mismatch' when the key returned on the first ask did not verify the signature **/
  reason: 'lookup' | 'signature-mismatch'
  /** Set when reason is 'signature-mismatch', the key that failed to verify the signature **/
  rejectedKey?: Uint8Array
}

/**
 * Returns 48-byte BLS quorum public key, or null when this source does not know the quorum
 */
export type QuorumKeyProvider = (request: QuorumKeyRequest) => Promise<Uint8Array | null>

export interface ProofVerificationOptions {
  /** Source of quorum public keys, default: platformExplorerQuorumKeyProvider **/
  quorumKeyProvider?: QuorumKeyProvider
  /** Ask the provider once more when its key does not verify the signature, default true **/
  keyRetry?: boolean
  /** Max age of the response metadata, default 15 minutes **/
  maxResponseAgeMs?: number
}

const equalBytes = (a: Uint8Array, b: Uint8Array): boolean => a.length === b.length && a.every((byte, i) => byte === b[i])

/**
 * Per SDK instance proof verification state: options and cache of quorum keys that verified a signature
 */
export class ProofVerificationContext {
  network: Network
  #provider: QuorumKeyProvider
  #keyRetry: boolean
  #maxResponseAgeMs: number
  #cache = new Map<string, Uint8Array>()

  constructor (network: Network, options?: ProofVerificationOptions) {
    this.network = network
    this.#provider = options?.quorumKeyProvider ?? platformExplorerQuorumKeyProvider
    this.#keyRetry = options?.keyRetry ?? true
    this.#maxResponseAgeMs = options?.maxResponseAgeMs ?? DEFAULT_MAX_RESPONSE_AGE_MS
  }

  /**
   * Verifies Tenderdash signature of the proof, throws {ProofVerificationError} on failure
   */
  async verify (proof: Proof, metadata: ResponseMetadata, rootHash: Uint8Array): Promise<void> {
    const timeMs = Number(metadata.timeMs)
    const ageMs = Date.now() - timeMs

    if (!Number.isFinite(timeMs) || ageMs > this.#maxResponseAgeMs || ageMs < -MAX_CLOCK_SKEW_MS) {
      throw new StaleResponseError(timeMs, ageMs)
    }

    const { quorumType, quorumHash } = proof
    const expectedQuorumType = PLATFORM_QUORUM_TYPES[this.network]

    if (quorumType !== expectedQuorumType) {
      throw new UnexpectedQuorumTypeError(expectedQuorumType, quorumType)
    }

    const check = async (key: Uint8Array): Promise<boolean> => {
      try {
        return await verifyTenderdashProof(proof, metadata, rootHash, key)
      } catch (e) {
        return false
      }
    }

    const cacheKey = bytesToHex(quorumHash)
    const cached = this.#cache.get(cacheKey)

    // a quorum has exactly one public key, and cached keys have already verified a signature,
    // so if a cached key fails, the proof is bad, not the key
    if (cached != null) {
      if (await check(cached)) {
        return
      }

      throw new ProofSignatureError(quorumType, quorumHash)
    }

    const request: QuorumKeyRequest = {
      network: this.network,
      quorumType,
      quorumHash,
      coreChainLockedHeight: metadata.coreChainLockedHeight,
      platformHeight: BigInt(metadata.height),
      reason: 'lookup'
    }

    let key: Uint8Array | null

    try {
      key = await this.#provider(request)
    } catch (e) {
      throw new QuorumKeyUnavailableError(quorumType, quorumHash, e)
    }

    if (key == null) {
      throw new QuorumKeyUnavailableError(quorumType, quorumHash)
    }

    if (key.length !== QUORUM_PUBLIC_KEY_LENGTH) {
      throw new QuorumKeyUnavailableError(quorumType, quorumHash, new Error(`Quorum key provider returned a key of ${key.length} bytes`))
    }

    if (await check(key)) {
      return this.#remember(cacheKey, key)
    }

    if (!this.#keyRetry) {
      throw new ProofSignatureError(quorumType, quorumHash)
    }

    let retryKey: Uint8Array | null

    try {
      retryKey = await this.#provider({ ...request, reason: 'signature-mismatch', rejectedKey: key })
    } catch (e) {
      throw new ProofSignatureError(quorumType, quorumHash, e)
    }

    // the same key again is not verified twice
    if (retryKey == null || retryKey.length !== QUORUM_PUBLIC_KEY_LENGTH || equalBytes(retryKey, key) || !(await check(retryKey))) {
      throw new ProofSignatureError(quorumType, quorumHash)
    }

    this.#remember(cacheKey, retryKey)
  }

  #remember (cacheKey: string, key: Uint8Array): void {
    this.#cache.set(cacheKey, key)

    if (this.#cache.size > QUORUM_KEY_CACHE_LIMIT) {
      this.#cache.delete(this.#cache.keys().next().value as string)
    }
  }
}

// SDK instances bind their context to the GRPC pool they pass to the method implementations,
// so call sites keep receiving only the pool
const contexts = new WeakMap<GRPCPool, ProofVerificationContext>()
const defaultContexts: Partial<Record<Network, ProofVerificationContext>> = {}

export function bindProofVerificationContext (grpcPool: GRPCPool, context: ProofVerificationContext): void {
  contexts.set(grpcPool, context)
}

/**
 * Verifies Tenderdash signature of the DAPI proof with quorum key from the configured provider.
 * Must be called after GroveDB proof verification, with the root hash it returned
 *
 * @throws {ProofVerificationError}
 */
export default async function verifyProofSignature (grpcPool: GRPCPool, proof: Proof, metadata: ResponseMetadata, rootHash: Uint8Array): Promise<void> {
  const context = contexts.get(grpcPool) ?? (defaultContexts[grpcPool.network] ??= new ProofVerificationContext(grpcPool.network))

  await context.verify(proof, metadata, rootHash)
}
