import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { PlatformClient } from '../proto/generated/platform.client.js'
import { GetStatusRequest } from '../proto/generated/platform.js'
import getCurrentQuorumsInfo, { CurrentQuorumsInfo } from './node/getCurrentQuorumsInfo.js'
import getRandomArrayItem from './utils/getRandomArrayItem.js'
import { Network } from '../types.js'
import { fetchWithDetails } from './utils/fetchWithDetails.js'

const GRPC_DEFAULT_POOL_LIMIT = 5
const HEALTHCHECK_TIMEOUT = 5000
export type MasternodeList = Record<string, MasternodeInfo>
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
  waitForInit?: () => Promise<void>
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

export const createClient = (url: string, abortController?: AbortController): PlatformClient => {
  return new PlatformClient(new GrpcWebFetchTransport({
    baseUrl: url,
    abort: abortController?.signal,
    fetch: fetchWithDetails
  }))
}

/**
 * Runs a request against the node, aborting it if the node did not respond in time
 */
const withTimeout = async <T>(url: string, request: (client: PlatformClient) => Promise<T>): Promise<T> => {
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), HEALTHCHECK_TIMEOUT)

  try {
    return await request(createClient(url, abortController))
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Checks that the node responds to the getStatus request
 */
const healthcheck = async (url: string): Promise<void> => {
  await withTimeout(url, async client => {
    const { response } = await client.getStatus(GetStatusRequest.create({}))

    if (response.version.oneofKind !== 'v0' || response.version.v0.chain == null) {
      throw new Error('Unexpected getStatus response')
    }
  })
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
    this.#initialize().catch(() => {})
  }

  /**
   * Starts pool initialization, or returns the one in progress / already finished.
   * Failed initialization is retried on the next call
   */
  async #initialize (): Promise<void> {
    if (this.#initialization == null) {
      this.#initialization = this._initialize(this.network, this.#poolLimit, this.#dapiUrl)
        .catch((e) => {
          this.#initialization = undefined

          throw e
        })
    }

    return await this.#initialization
  }

  async _initialize (network: Network, poolLimit: number, dapiUrl?: string | string[]): Promise<void> {
    if (typeof dapiUrl === 'string') {
      this.dapiUrls = [dapiUrl]

      return
    }

    if (Array.isArray(dapiUrl)) {
      this.dapiUrls = dapiUrl

      return
    }

    if (dapiUrl != null) {
      throw new Error('Unrecognized DAPI URL')
    }

    // healthcheck seed nodes, they are used only to discover evonodes
    const seeds = seedNodes[network]
    const seedResults = await Promise.allSettled(seeds.map(healthcheck))
    const healthySeeds = seeds.filter((seed, i) => seedResults[i].status === 'fulfilled')

    if (healthySeeds.length === 0) {
      const errors = seedResults.map(result => (result as PromiseRejectedResult).reason)

      throw new AggregateError(errors, `None of the ${network} seed nodes are available`)
    }

    // request quorums info from the first healthy seed that is able to respond
    let quorumsInfo: CurrentQuorumsInfo | undefined
    const quorumsInfoErrors: unknown[] = []

    for (const seed of healthySeeds) {
      try {
        quorumsInfo = await withTimeout(seed, async client => await getCurrentQuorumsInfo({ network, getClient: () => client }))

        break
      } catch (e) {
        quorumsInfoErrors.push(e)
      }
    }

    if (quorumsInfo == null) {
      throw new AggregateError(quorumsInfoErrors, `Could not retrieve quorums info from ${network} seed nodes`)
    }

    // map validator sets to array of evonode urls
    const candidates = [...new Set(quorumsInfo.validatorSets
      .flatMap(validatorSet => validatorSet.members)
      .filter(member => !member.isBanned)
      .map(member => `https://${member.nodeIp}:${DAPI_PORTS[network]}`))]

    // healthcheck evonodes in parallel batches until the pool is filled
    const dapiUrls: string[] = []

    while (dapiUrls.length < poolLimit && candidates.length > 0) {
      const batch = candidates.splice(0, poolLimit - dapiUrls.length)
      const results = await Promise.allSettled(batch.map(healthcheck))

      dapiUrls.push(...batch.filter((url, i) => results[i].status === 'fulfilled'))
    }

    if (dapiUrls.length === 0) {
      throw new Error(`None of the ${network} evonodes are available`)
    }

    this.dapiUrls = dapiUrls
  }

  /**
   * Resolves when the pool initialization (seed nodes check and evonodes discovery) is finished.
   * Calling it is optional, `getClient()` waits for initialization by itself,
   * but it can be used to warm up the pool or to catch unavailable network early
   */
  async waitForInit (): Promise<void> {
    await this.#initialize()
  }

  /**
   * Returns a client for a random healthy node from the pool, waiting for the pool initialization if needed
   */
  async getClient (abortController?: AbortController): Promise<PlatformClient> {
    await this.#initialize()

    const dapiUrl = getRandomArrayItem(this.dapiUrls)

    return createClient(dapiUrl, abortController)
  }
}
