import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { PlatformClient } from '../proto/generated/platform.client.js'
import { GetStatusRequest } from '../proto/generated/platform.js'
import getCurrentQuorumsInfo, { CurrentQuorumsInfo } from './node/getCurrentQuorumsInfo.js'
import getRandomArrayItem from './utils/getRandomArrayItem.js'
import { Network } from '../types.js'
import { fetchWithDetails } from './utils/fetchWithDetails.js'

const GRPC_DEFAULT_POOL_LIMIT = 5

export interface GRPCOptions {
  poolLimit?: number
  dapiUrl?: string | string[]
  /** Custom connection pool, if set, `poolLimit` and `dapiUrl` are ignored **/
  pool?: GRPCPool
}

/**
 * Minimal interface the SDK requires from a GRPC connection pool.
 * Implement it to supply your own node selection, retries, transport options, etc.
 */
export interface GRPCPool {
  network: Network
  getClient: (abortController?: AbortController) => PlatformClient | Promise<PlatformClient>
}

export interface MasternodeInfo {
  proTxHash: string
  address: string
  payee: string
  status: string
  type: string
  platformNodeID: string
  platformP2PPort: number
  platformHTTPPort: number
  pospenaltyscore: number
  consecutivePayments: number
  lastpaidtime: number
  lastpaidblock: number
  owneraddress: string
  votingaddress: string
  collateraladdress: string
  pubkeyoperator: string
}

const seedNodes = {
  testnet: [
    // seed-1.pshenmic.dev
    'https://153.80.206.232:1443',
    // DCG seed
    'https://34.209.12.72:1443',
    // Testnet validators (hp-masternode-1 -> hp-masternode-15)
    'https://68.67.122.1:1443',
    'https://68.67.122.2:1443',
    'https://68.67.122.3:1443',
    'https://68.67.122.4:1443',
    'https://68.67.122.5:1443',
    'https://68.67.122.6:1443',
    'https://68.67.122.7:1443',
    'https://68.67.122.8:1443',
    'https://68.67.122.9:1443',
    'https://68.67.122.10:1443',
    'https://68.67.122.11:1443',
    'https://68.67.122.12:1443',
    'https://68.67.122.13:1443',
    'https://68.67.122.14:1443',
    'https://68.67.122.15:1443'
  ],
  mainnet: [
    // seed-1.pshenmic.dev
    'https://153.80.206.97:443',
    // DCG seed
    'https://34.211.174.194:443',
    // validator
    'https://95.216.146.18:443'
  ]
}

const DAPI_PORTS = {
  testnet: 1443,
  mainnet: 443
}

const HEALTHCHECK_TIMEOUT_MS = 5000

export const createClient = (url: string, abortController?: AbortController): PlatformClient => {
  return new PlatformClient(new GrpcWebFetchTransport({
    baseUrl: url,
    abort: abortController?.signal,
    fetch: fetchWithDetails
  }))
}

/**
 * Runs a request with an AbortController that is aborted after the given timeout
 */
const withTimeout = async <T>(request: (abortController: AbortController) => Promise<T>, timeoutMs = HEALTHCHECK_TIMEOUT_MS): Promise<T> => {
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), timeoutMs)

  try {
    return await request(abortController)
  } finally {
    clearTimeout(timeout)
  }
}

const isNodeHealthy = async (url: string): Promise<boolean> => {
  try {
    const { response } = await withTimeout(async abortController =>
      await createClient(url, abortController).getStatus(GetStatusRequest.create({})))

    return response.version.oneofKind === 'v0' && response.version.v0.chain != null
  } catch (e) {
    return false
  }
}

const shuffle = <T>(array: T[]): T[] => {
  const result = [...array]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

export default class GRPCConnectionPool implements GRPCPool {
  dapiUrls: string[] = []
  network: Network
  #poolLimit: number
  #dapiUrl?: string | string[]
  #initialization?: Promise<void>

  constructor (network: Network, grpcOptions?: GRPCOptions) {
    this.network = network
    this.#poolLimit = grpcOptions?.poolLimit ?? GRPC_DEFAULT_POOL_LIMIT
    this.#dapiUrl = grpcOptions?.dapiUrl

    // start initialization in the background, failures are reported on the first request
    this.#initialization = this._initialize(network, this.#poolLimit, this.#dapiUrl)
    this.#initialization.catch(() => {})
  }

  async _initialize (network: Network, poolLimit: number, dapiUrl?: string | string[]): Promise<void> {
    if (typeof dapiUrl === 'string') {
      this.dapiUrls = [dapiUrl]

      return
    }

    if (Array.isArray(dapiUrl)) {
      this.dapiUrls = [...new Set(dapiUrl)]

      if (this.dapiUrls.length === 0) {
        throw new Error('DAPI URL list is empty')
      }

      return
    }

    if (dapiUrl != null) {
      throw new Error('Unrecognized DAPI URL')
    }

    const seeds = seedNodes[network]

    // healthcheck seed nodes in parallel with the quorums info requests,
    // seed nodes are added to the pool only after they passed the healthcheck
    const seedHealthchecks = seeds.map(async seed => {
      if (await isNodeHealthy(seed)) {
        this.#addNode(seed, poolLimit)
      }
    })

    // retrieve evonodes from current validator sets through the first responding seed node
    let quorumsInfo: CurrentQuorumsInfo

    try {
      quorumsInfo = await Promise.any(seeds.map(async seed => await withTimeout(async abortController =>
        await getCurrentQuorumsInfo({ network, getClient: () => createClient(seed, abortController) }))))
    } catch (e) {
      const errors: unknown[] = e instanceof AggregateError ? e.errors : [e]

      throw new AggregateError(errors, `None of the ${network} seed nodes are available: ${errors.map(String).join('; ')}`)
    }

    // map it to array of dapiUrls
    const networkDAPIUrls = shuffle([...new Set(quorumsInfo.validatorSets
      .flatMap(validatorSet => validatorSet.members)
      .filter(member => !member.isBanned)
      .map(member => `https://${member.nodeIp}:${DAPI_PORTS[network]}`))])
      .filter(url => !this.dapiUrls.includes(url))

    // healthcheck nodes in parallel batches until the pool is full
    for (let i = 0; i < networkDAPIUrls.length && this.dapiUrls.length < poolLimit; i += poolLimit) {
      const batch = networkDAPIUrls.slice(i, i + poolLimit)

      await Promise.all(batch.map(async url => {
        if (await isNodeHealthy(url)) {
          this.#addNode(url, poolLimit)
        }
      }))
    }

    // wait until every seed node healthcheck is finished, so all live seeds are added to the pool
    await Promise.all(seedHealthchecks)
  }

  /**
   * Adds a node to the pool, unless it is already there or the pool is full
   */
  #addNode (url: string, poolLimit: number): void {
    if (!this.dapiUrls.includes(url) && this.dapiUrls.length < poolLimit) {
      this.dapiUrls.push(url)
    }
  }

  /**
   * Waits for the pool initialization and returns a client connected to a random healthy node
   */
  async getClient (abortController?: AbortController): Promise<PlatformClient> {
    // retry initialization if the previous attempt failed
    this.#initialization ??= this._initialize(this.network, this.#poolLimit, this.#dapiUrl)

    const initialization = this.#initialization

    try {
      await initialization
    } catch (e) {
      // other callers may have already started a new attempt
      if (this.#initialization === initialization) {
        this.#initialization = undefined
      }

      throw e
    }

    const dapiUrl = getRandomArrayItem(this.dapiUrls)

    return createClient(dapiUrl, abortController)
  }
}
