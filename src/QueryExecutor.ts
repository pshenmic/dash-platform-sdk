import { PlatformClient } from '../proto/generated/platform.client.js'
import { Proof, ResponseMetadata } from '../proto/generated/platform.js'
import { GRPCPool } from './grpcConnectionPool.js'
import { getQuorumPublicKey } from './utils/getQuorumPublicKey.js'
import bytesToHex from './utils/bytesToHex.js'
import verifyTenderdashProof from './utils/verifyTenderdashProof.js'
import ProofError from './utils/ProofError.js'
import sleep from './utils/sleep.js'

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
type ProofExtractor<Response> = (response: Response) => ResponseProof
type GroveDBVerifier<Args extends unknown[], V> = (grovedbProof: Uint8Array, ...args: Args) => V

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
 * Data of a query for the mapper, either verified from the proof (`proved: true`)
 * or the result of the response requested without proof (`proved: false`)
 */
export type QueryData<Response, V> = {
  proved: true
  verified: V
  metadata: ResponseMetadata
} | {
  proved: false
  result: ResponseResult<Response>
  metadata: ResponseMetadata
}

type ResultMapper<Response, V, T> = (data: QueryData<Response, V>) => T | Promise<T>

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
 * - with proofs: request (`prove: true`) -> proof extraction -> GroveDB proof verification -> quorum signature verification -> mapping
 * - without proofs: request (`prove: false`) -> mapping of the response result
 *
 * The mapper handles both cases, the verified data or the response result, see {QueryData}.
 * Requests without the `prove` field are always proved
 *
 * If the proof is invalid (ProofError), the node is banned and the request is sent again to another node,
 * the node that returned a valid proof is unbanned. Any other error (including "not found") is thrown immediately
 *
 * @example
 * const balance = await QueryExecutor.build(grpcPool)
 *   .addGrpcRequest('getIdentityBalance', request)
 *   .addProofVerifier(verifyIdentityBalanceProof, id.bytes(), true, LATEST_PLATFORM_VERSION)
 *   .addMapper(data => data.proved ? data.verified.balance : BigInt(data.result.balance))
 *   .execute()
 */
export default class QueryExecutor<Response = unknown, V = unknown, T = unknown> {
  readonly #grpcPool: GRPCPool
  #request?: GrpcRequest<Response>
  #requestMessage?: unknown
  #extractProof: ProofExtractor<Response> = getResponseProof as unknown as ProofExtractor<Response>
  #verifyProof?: (responseProof: ResponseProof) => V
  #map?: ResultMapper<Response, V, T>
  #validateProof = true

  private constructor (grpcPool: GRPCPool) {
    this.#grpcPool = grpcPool
  }

  static build (grpcPool: GRPCPool): QueryExecutor {
    return new QueryExecutor(grpcPool)
  }

  /**
   * Sets the GRPC request, it is sent again on every retry.
   * The `prove` field of the request is set by the executor
   */
  addGrpcRequest<M extends keyof PlatformClientMethods>(
    method: M,
    request: Parameters<PlatformClientMethods[M]>[0]
  ): QueryExecutor<
    Awaited<ReturnType<PlatformClientMethods[M]>> extends { response: infer R }
      ? R
      : never,
    V,
    T
    > {
    const executor = this as unknown as QueryExecutor<
    Awaited<ReturnType<PlatformClientMethods[M]>> extends { response: infer R }
      ? R
      : never,
    V,
    T
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
   * Overrides the extraction of the proof and the metadata from the response (v0 response by default)
   */
  setProofExtractor (extractProof: ProofExtractor<Response>): this {
    this.#extractProof = extractProof

    return this
  }

  /**
   * Sets the GroveDB proof verification function, which is called with the GroveDB proof of the response
   * followed by the given args. Args depending on the response (e.g. metadata) can be passed as a callback.
   * Failure of the verification is thrown as ProofError, so the request is retried on another node
   */
  addProofVerifier<Args extends unknown[] | [], U> (
    verify: GroveDBVerifier<Args, U>,
    getArgs: (responseProof: ResponseProof) => NoInfer<Args>
  ): QueryExecutor<Response, U, T>
  addProofVerifier<Args extends unknown[] | [], U> (
    verify: GroveDBVerifier<Args, U>,
    ...args: Args
  ): QueryExecutor<Response, U, T>
  addProofVerifier<Args extends unknown[] | [], U> (
    verify: GroveDBVerifier<Args, U>,
    ...args: Args | [(responseProof: ResponseProof) => Args]
  ): QueryExecutor<Response, U, T> {
    const executor = this as unknown as QueryExecutor<Response, U, T>

    const getArgs = args.length === 1 && typeof args[0] === 'function'
      ? args[0] as (responseProof: ResponseProof) => Args
      : () => args as Args

    executor.#verifyProof = (responseProof) => {
      try {
        return verify(responseProof.proof.grovedbProof, ...getArgs(responseProof))
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
  addMapper<U> (map: ResultMapper<Response, V, U>): QueryExecutor<Response, V, U> {
    const executor = this as unknown as QueryExecutor<Response, V, U>

    executor.#map = map

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
    const map = this.#map

    if (request == null) {
      throw new Error('GRPC request is not set, call addGrpcRequest() before execute()')
    }

    if (this.#verifyProof == null) {
      throw new Error('Proof verification is not set, call addProofVerifier() before execute()')
    }

    if (map == null) {
      throw new Error('Mapper is not set, call addMapper() before execute()')
    }

    const requestBody = getVersionBody(this.#requestMessage)
    const canSkipProof = requestBody != null && 'prove' in requestBody
    const prove = this.#grpcPool.proofs !== false || !canSkipProof

    if (canSkipProof) {
      requestBody.prove = prove
    }

    return await map(prove ? await this.#executeWithProof(request) : await this.#executeWithoutProof(request))
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

    return { proved: false, result: result as ResponseResult<Response>, metadata }
  }

  async #executeWithProof (request: GrpcRequest<Response>): Promise<QueryData<Response, V>> {
    const verifyProof = this.#verifyProof as (responseProof: ResponseProof) => V
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

        const responseProof = this.#extractProof(response)
        const verified = verifyProof(responseProof)

        if (this.#validateProof) {
          await this.#verifySignature(responseProof, (verified as { rootHash?: Uint8Array }).rootHash)

          grpcPool.unbanNode?.(client)
        }

        return { proved: true, verified, metadata: responseProof.metadata }
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

    const quorumPublicKey = await getQuorumPublicKey(this.#grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

    if (!verify) {
      throw new ProofError('Failed to verify query')
    }
  }
}
