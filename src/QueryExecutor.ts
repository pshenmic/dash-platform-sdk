import { PlatformClient } from '../proto/generated/platform.client.js'
import { Proof, ResponseMetadata } from '../proto/generated/platform.js'
import { GRPCPool } from './grpcConnectionPool.js'
import { QuorumKeyProvider } from './quorumKeyProvider.js'
import bytesToHex from './utils/bytesToHex.js'
import verifyTenderdashProof from './utils/verifyTenderdashProof.js'
import ProofError from './utils/ProofError.js'
import sleep from './utils/sleep.js'
import { PlatformVersionWASM } from 'pshenmic-dpp'
import { LATEST_PLATFORM_VERSION, MIN_PROTOCOL_VERSION } from './constants.js'

const RETRY_DELAY_MS = 10

type SubType<Base, Condition> = Pick<Base, {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>

type PlatformClientMethods = SubType<PlatformClient, (...args: any[]) => any>

/**
 * Proof and metadata of a response, `proof` and `metadata` are required to verify the quorum signature of the proof
 */
export interface ResponseProof {
  proof: Proof
  metadata: ResponseMetadata
}

type GrpcRequest<Response> = (client: PlatformClient) => PromiseLike<{ response: Response }>
type MapProof<Response, P extends ResponseProof = ResponseProof> = (response: Response) => P
type GroveDBVerifier<Args extends unknown[], V> = (grovedbProof: Uint8Array, ...args: Args) => V
type GetVerifierArgs<P, Args> = (responseProof: P, platformVersion: PlatformVersionWASM) => Args

/**
 * Body of the version (e.g. `v0`) of a versioned response, distributed over all versions
 */
type VersionBody<Version> = Version extends { oneofKind: infer K extends string }
  ? K extends keyof Version ? Version[K] : never
  : never

/**
 * Result of a response requested without proof, `version.v0.result` without the proof case
 */
export type ResponseResult<Response> = Response extends { version: infer Version }
  ? VersionBody<Version> extends infer Body
    ? Body extends { result: infer R } ? Exclude<R, { oneofKind: 'proof' | undefined }> : never
    : never
  : never

/**
 * Data of a query passed to `mapResponse`, either verified from the proof (`proved: true`)
 * or the result of the response requested without proof (`proved: false`)
 */
export type QueryData<Response, V> = {
  proved: true
  verified: V
  metadata: ResponseMetadata
  /** Platform version the proof was verified with, see {getVerifierVersion} **/
  platformVersion: PlatformVersionWASM
} | {
  proved: false
  result: ResponseResult<Response>
  metadata: ResponseMetadata
  /**
   * Platform version to parse the response with, the protocol version of the response is used to parse it
   * (like the response itself, it is not verified), but it is not learned by the pool
   */
  platformVersion: PlatformVersionWASM
}

type MapResponse<Response, V, T> = (data: QueryData<Response, V>) => T | Promise<T>

/**
 * Generic shape of a request or a response with versioned body
 */
interface Versioned {
  version?: { oneofKind?: string, [version: string]: unknown }
}

/**
 * Returns the versioned body of a request or a response (e.g. `version.v0`)
 */
function getVersionBody (message: unknown): Record<string, unknown> | undefined {
  const { version } = (message ?? {}) as Versioned

  if (version?.oneofKind == null) {
    return undefined
  }

  return version[version.oneofKind] as Record<string, unknown> | undefined
}

// highest protocol version of the verified responses of the pool, unlike `grpcPool.protocolVersion` it is never seeded
const verifiedProtocolVersions = new WeakMap<GRPCPool, number>()

/**
 * Returns the highest protocol version of the responses of the pool whose proof and quorum signature were verified,
 * or undefined if no response was verified yet
 */
export function getVerifiedProtocolVersion (grpcPool: GRPCPool): number | undefined {
  return verifiedProtocolVersions.get(grpcPool)
}

/**
 * Returns the protocol version of the pool, the lowest version the network runs if it was not learned yet
 */
export function getPoolProtocolVersion (grpcPool: GRPCPool): PlatformVersionWASM {
  return Math.min(grpcPool.protocolVersion ?? MIN_PROTOCOL_VERSION[grpcPool.network], LATEST_PLATFORM_VERSION)
}

/**
 * Returns the platform version to verify a response signed with the given protocol version.
 * A newer signed version is used (up to the latest version known to the SDK), an older one is not,
 * so a node behind the network fails the verification and the request is sent to another node.
 *
 * Choosing the version before the quorum signature is verified is safe:
 * the signature covers the protocol version, so a false version fails the verification
 */
export function getVerifierVersion (protocolVersion: number, signedProtocolVersion: number): PlatformVersionWASM {
  return Math.min(Math.max(protocolVersion, signedProtocolVersion), LATEST_PLATFORM_VERSION)
}

/**
 * Raises the protocol version of the pool to the one of a response whose proof and quorum signature were verified.
 * The version is never lowered, versions unknown to the SDK are ignored
 */
function updateProtocolVersion (grpcPool: GRPCPool, signedProtocolVersion: number): void {
  verifiedProtocolVersions.set(grpcPool, Math.max(verifiedProtocolVersions.get(grpcPool) ?? 0, signedProtocolVersion))

  if (signedProtocolVersion > getPoolProtocolVersion(grpcPool) && signedProtocolVersion <= LATEST_PLATFORM_VERSION) {
    grpcPool.protocolVersion = signedProtocolVersion
  }
}

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
export function getResponseProof (response: ProvedResponse): ResponseProof {
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
 * Sends a GRPC request to a node from the pool and returns the mapped result of the response.
 *
 * Queries are requested with proofs, unless proofs are disabled in the pool (`grpcPool.proofs === false`):
 * - with proofs: request (`prove: true`) -> proof mapping -> GroveDB proof verification -> quorum signature verification -> protocol version update -> mapping
 * - without proofs: request (`prove: false`) -> mapping of the response result
 *
 * The protocol version of the pool is raised to the protocol version of the verified responses,
 * the platform version to verify the proof with is passed to the args callback of the proof verifier, see {getVerifierVersion}
 *
 * `mapResponse` handles both cases, the verified data or the response result, see {QueryData}.
 * Requests without the `prove` field are always proved
 *
 * If the proof is invalid (ProofError), the node is banned and the request is sent again to another node,
 * the node that returned a valid proof is unbanned. Any other error (including "not found") is thrown immediately
 *
 * @example
 * const balance = await QueryExecutor.build(grpcPool, quorumKeyProvider)
 *   .setGrpcRequest('getIdentityBalance', request)
 *   .setProofVerifier(verifyIdentityBalanceProof, (_, platformVersion) => [id.bytes(), true, platformVersion])
 *   .mapResponse(data => data.proved ? data.verified.balance : BigInt(data.result.balance))
 *   .execute()
 */
export default class QueryExecutor<Response = unknown, V = unknown, T = unknown, P extends ResponseProof = ResponseProof> {
  readonly #grpcPool: GRPCPool
  readonly #quorumKeyProvider: QuorumKeyProvider
  #request?: GrpcRequest<Response>
  #requestMessage?: unknown
  #mapProof: MapProof<Response, P> = getResponseProof as unknown as MapProof<Response, P>
  #verifyProof?: (responseProof: P, platformVersion: PlatformVersionWASM) => V
  #mapResponse?: MapResponse<Response, V, T>
  #validateProof = true
  #requireProof = false

  private constructor (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider) {
    this.#grpcPool = grpcPool
    this.#quorumKeyProvider = quorumKeyProvider
  }

  static build (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider): QueryExecutor {
    return new QueryExecutor(grpcPool, quorumKeyProvider)
  }

  /**
   * Sets the GRPC request, it is sent again on every retry.
   * The `prove` field of the request is set by the executor
   */
  setGrpcRequest<M extends keyof PlatformClientMethods>(
    method: M,
    request: Parameters<PlatformClientMethods[M]>[0]
  ): QueryExecutor<
    Awaited<ReturnType<PlatformClientMethods[M]>> extends { response: infer R }
      ? R
      : never,
    V,
    T,
    P
    > {
    const executor = this as unknown as QueryExecutor<
    Awaited<ReturnType<PlatformClientMethods[M]>> extends { response: infer R }
      ? R
      : never,
    V,
    T,
    P
    >

    executor.#requestMessage = request
    executor.#request = (client) => {
      const fn = client[method] as (
        request: Parameters<PlatformClientMethods[M]>[0]
      ) => ReturnType<PlatformClientMethods[M]>

      return fn.call(client, request)
    }

    return executor
  }

  /**
   * Overrides the mapping of the response to the proof and the metadata (v0 response by default).
   * Additional data of the proof (e.g. a second proof) is passed to the args callback of the proof verifier
   */
  mapProof<E extends ResponseProof> (mapProof: MapProof<Response, E>): QueryExecutor<Response, V, T, E> {
    const executor = this as unknown as QueryExecutor<Response, V, T, E>

    executor.#mapProof = mapProof

    return executor
  }

  /**
   * Sets the GroveDB proof verification function, which is called with the GroveDB proof of the response
   * followed by the given args. Args depending on the response (e.g. metadata) or the platform version
   * to verify the proof with can be passed as a callback.
   * Failure of the verification is thrown as ProofError, so the request is retried on another node
   */
  setProofVerifier<Args extends unknown[] | [], U> (
    verify: GroveDBVerifier<Args, U>,
    getArgs: GetVerifierArgs<P, NoInfer<Args>>
  ): QueryExecutor<Response, U, T, P>
  setProofVerifier<Args extends unknown[] | [], U> (
    verify: GroveDBVerifier<Args, U>,
    ...args: Args
  ): QueryExecutor<Response, U, T, P>
  setProofVerifier<Args extends unknown[] | [], U> (
    verify: GroveDBVerifier<Args, U>,
    ...args: Args | [GetVerifierArgs<P, Args>]
  ): QueryExecutor<Response, U, T, P> {
    const executor = this as unknown as QueryExecutor<Response, U, T, P>

    const getArgs = args.length === 1 && typeof args[0] === 'function'
      ? args[0] as GetVerifierArgs<P, Args>
      : () => args as Args

    executor.#verifyProof = (responseProof, platformVersion) => {
      try {
        return verify(responseProof.proof.grovedbProof, ...getArgs(responseProof, platformVersion))
      } catch (e) {
        throw new ProofError(`Failed to verify GroveDB proof: ${String(e)}`, { cause: e })
      }
    }

    return executor
  }

  /**
   * Sets the mapping of the query data to the result of the query, also the place for "not found" checks.
   * The data is either verified from the proof or the result of the response requested without proof
   */
  mapResponse<U> (mapResponse: MapResponse<Response, V, U>): QueryExecutor<Response, V, U, P> {
    const executor = this as unknown as QueryExecutor<Response, V, U, P>

    executor.#mapResponse = mapResponse

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

  /**
   * Requests and verifies the proof even if proofs are disabled in the pool,
   * e.g. to learn the protocol version of the network from a verified response
   */
  setRequireProof (requireProof: boolean): this {
    this.#requireProof = requireProof

    return this
  }

  async execute (): Promise<T> {
    const request = this.#request
    const mapResponse = this.#mapResponse

    if (request == null) {
      throw new Error('GRPC request is not set, call setGrpcRequest() before execute()')
    }

    if (this.#verifyProof == null) {
      throw new Error('Proof verification is not set, call setProofVerifier() before execute()')
    }

    if (mapResponse == null) {
      throw new Error('Response mapping is not set, call mapResponse() before execute()')
    }

    const requestBody = getVersionBody(this.#requestMessage)
    const canSkipProof = requestBody != null && 'prove' in requestBody
    const prove = this.#requireProof || this.#grpcPool.proofs !== false || !canSkipProof

    if (canSkipProof) {
      requestBody.prove = prove
    }

    return await mapResponse(prove ? await this.#executeWithProof(request) : await this.#executeWithoutProof(request))
  }

  async #executeWithoutProof (request: GrpcRequest<Response>): Promise<QueryData<Response, V>> {
    const client = await this.#grpcPool.getClient()
    const { response } = await request(client)

    const body = getVersionBody(response)
    const result = body?.result as { oneofKind?: string } | undefined
    const metadata = body?.metadata as ResponseMetadata | undefined

    if (result?.oneofKind == null || result.oneofKind === 'proof') {
      throw new Error(`Unexpected oneOf type returned from DAPI (${String(result?.oneofKind)})`)
    }

    if (metadata == null) {
      throw new Error('Metadata not found')
    }

    return { proved: false, result: result as ResponseResult<Response>, metadata, platformVersion: getVerifierVersion(getPoolProtocolVersion(this.#grpcPool), metadata.protocolVersion) }
  }

  async #executeWithProof (request: GrpcRequest<Response>): Promise<QueryData<Response, V>> {
    const verifyProof = this.#verifyProof as (responseProof: P, platformVersion: PlatformVersionWASM) => V
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

        const responseProof = this.#mapProof(response)
        const { metadata } = responseProof
        const platformVersion = getVerifierVersion(getPoolProtocolVersion(grpcPool), metadata.protocolVersion)
        const verified = verifyProof(responseProof, platformVersion)

        if (this.#validateProof) {
          await this.#verifySignature(responseProof, (verified as { rootHash?: Uint8Array }).rootHash)

          // protocol version is learned only from the responses with verified quorum signature
          updateProtocolVersion(grpcPool, metadata.protocolVersion)

          grpcPool.unbanNode?.(client)
        }

        return { proved: true, verified, metadata, platformVersion }
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

  async #verifySignature ({ proof, metadata }: ResponseProof, rootHash?: Uint8Array): Promise<void> {
    if (rootHash == null) {
      throw new Error('Root hash is required to validate the proof, return it from the proof verifier or call setValidateProof(false)')
    }

    const quorumPublicKey = await this.#quorumKeyProvider.getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

    if (!verify) {
      throw new ProofError('Failed to verify query')
    }
  }
}
