import { PlatformClient } from '../../proto/generated/platform.client.js'
import { Proof, ResponseMetadata } from '../../proto/generated/platform.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import { getQuorumPublicKey } from './getQuorumPublicKey.js'
import bytesToHex from './bytesToHex.js'
import verifyTenderdashProof from './verifyTenderdashProof.js'
import ProofError from './ProofError.js'
import sleep from './sleep.js'

const RETRY_DELAY_MS = 10

/**
 * Result of the proof verification of a response, `proof`, `metadata` and `rootHash`
 * are required to verify the quorum signature of the proof
 */
export interface VerifiedProof<T> {
  result: T
  rootHash?: Uint8Array
  proof?: Proof
  metadata?: ResponseMetadata
}

type GrpcRequest<Response> = (client: PlatformClient) => PromiseLike<{ response: Response }>
type ProofVerifier<Response, T> = (response: Response) => VerifiedProof<T> | Promise<VerifiedProof<T>>

/**
 * Minimal shape of a v0 response that may contain a proof
 */
interface ProvedResponse {
  version: {
    oneofKind: string | undefined
    v0?: {
      result: { oneofKind: string | undefined, proof?: Proof }
      metadata?: ResponseMetadata
    }
  }
}

/**
 * Returns the proof and the metadata of a v0 response, requested with `prove: true`
 */
export function getResponseProof (response: ProvedResponse): { proof: Proof, metadata: ResponseMetadata } {
  const { version } = response

  if (version.oneofKind !== 'v0' || version.v0 == null) {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
  }

  const { result, metadata } = version.v0

  if (result.oneofKind !== 'proof' || result.proof == null) {
    throw new Error('Unexpected oneOf type returned from DAPI (must be proof)')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  return { proof: result.proof, metadata }
}

/**
 * Sends a GRPC request to a node from the pool and verifies the proof of its response.
 * If the proof is invalid (ProofError), the node is banned and the request is sent again to another node,
 * the node that returned a valid proof is unbanned. Any other error (including "not found") is thrown immediately
 *
 * @example
 * const balance = await QueryExecutor.build(grpcPool)
 *   .addGrpcRequest(client => client.getIdentityBalance(request))
 *   .addProof(response => {
 *     const { proof, metadata } = getResponseProof(response)
 *     const { rootHash, balance } = verifyGroveDBProof(verifyIdentityBalanceProof, proof.grovedbProof, ...)
 *
 *     return { result: balance, rootHash, proof, metadata }
 *   })
 *   .execute()
 */
export default class QueryExecutor<Response = unknown, T = unknown> {
  readonly #grpcPool: GRPCPool
  #request?: GrpcRequest<Response>
  #verify?: ProofVerifier<Response, T>
  #validateProof = true

  private constructor (grpcPool: GRPCPool) {
    this.#grpcPool = grpcPool
  }

  static build (grpcPool: GRPCPool): QueryExecutor {
    return new QueryExecutor(grpcPool)
  }

  /**
   * Sets the GRPC request, it is sent again on every retry
   */
  addGrpcRequest<R> (request: GrpcRequest<R>): QueryExecutor<R, T> {
    const executor = this as unknown as QueryExecutor<R, T>

    executor.#request = request

    return executor
  }

  /**
   * Sets the verification of the GroveDB proof of the response, which returns the result of the query.
   * The quorum signature of the proof is verified by the executor
   */
  addProof<U> (verify: ProofVerifier<Response, U>): QueryExecutor<Response, U> {
    const executor = this as unknown as QueryExecutor<Response, U>

    executor.#verify = verify

    return executor
  }

  /**
   * Enables (default) or disables the verification of the quorum signature of the proof,
   * e.g. if the GroveDB proof is verified against an already verified root hash
   */
  setValidateProof (validateProof: boolean): this {
    this.#validateProof = validateProof

    return this
  }

  async execute (): Promise<T> {
    const request = this.#request
    const verify = this.#verify

    if (request == null) {
      throw new Error('GRPC request is not set, call addGrpcRequest() before execute()')
    }

    if (verify == null) {
      throw new Error('Proof verification is not set, call addProof() before execute()')
    }

    const grpcPool = this.#grpcPool
    // custom pools without retries are not retried
    const retries = grpcPool.retries ?? 0
    let lastError: ProofError | undefined

    for (let retry = 0; ; retry++) {
      let client: PlatformClient

      try {
        client = await grpcPool.getClient()
      } catch (e) {
        // every node is banned, the last proof error is more useful than "no available nodes"
        throw lastError ?? e
      }

      try {
        const { response } = await request(client)
        const verified = await verify(response)

        if (this.#validateProof) {
          await this.#verifySignature(verified)

          grpcPool.unbanNode?.(client)
        }

        return verified.result
      } catch (e) {
        if (!(e instanceof ProofError)) {
          throw e
        }

        grpcPool.banNode?.(client)

        if (retry >= retries) {
          throw e
        }

        lastError = e

        await sleep(RETRY_DELAY_MS)
      }
    }
  }

  async #verifySignature ({ proof, metadata, rootHash }: VerifiedProof<T>): Promise<void> {
    if (proof == null || metadata == null || rootHash == null) {
      throw new Error('Proof, metadata and root hash are required to validate the proof, return them from addProof() or call setValidateProof(false)')
    }

    const quorumPublicKey = await getQuorumPublicKey(this.#grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

    if (!verify) {
      throw new ProofError('Failed to verify query')
    }
  }
}
