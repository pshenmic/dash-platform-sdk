import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { PlatformClient } from '../proto/generated/platform.client.js'
import { GetStatusRequest } from '../proto/generated/platform.js'
import getCurrentQuorumsInfo, { CurrentQuorumsInfo } from './node/getCurrentQuorumsInfo.js'
import { Network } from '../types.js'
import { fetchWithDetails } from './utils/fetchWithDetails.js'
import { LATEST_PLATFORM_VERSION } from './constants.js'
import sleep from './utils/sleep.js'

const GRPC_DEFAULT_POOL_LIMIT = 15
const GRPC_DEFAULT_CONNECT_RETRIES = 5
// first ban lasts 60 seconds, every next ban without a successful request in between lasts e times longer
const NODE_BASE_BAN_PERIOD_MS = 60 * 1000
const RETRY_DELAY_MS = 10

export interface GRPCOptions {
  poolLimit?: number
  dapiUrl?: string | string[]
  retries?: number
  /** Custom connection pool, if set, `poolLimit`, `dapiUrl` and `retries` are ignored **/
  pool?: GRPCPool
}

/**
 * Minimal interface the SDK requires from a GRPC connection pool.
 * Implement it to supply your own node selection, retries, transport options, etc.
 */
export interface GRPCPool {
  network: Network
  getClient: (abortController?: AbortController) => PlatformClient | Promise<PlatformClient>
  /** How many times a request is retried on another node, if not set, the SDK default is used **/
  retries?: number
  /** Temporarily excludes the node that served the request of the client from node selection, e.g. after an invalid proof **/
  banNode?: (client: PlatformClient) => void
  /** Lifts the ban of the node that served the request of the client, e.g. after its response was verified **/
  unbanNode?: (client: PlatformClient) => void
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
// platform produces empty blocks every 3 minutes, so a healthy chain is never older than that
const HEALTHCHECK_MAX_BLOCK_AGE_MS = 10 * 60 * 1000

const isAbortError = (error: unknown): boolean => error instanceof Error && error.name === 'AbortError'

// errors raised before the request is sent to the node, so it is always safe to send it to another node
const CONNECT_ERROR_CODES = ['UND_ERR_CONNECT_TIMEOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'ENETUNREACH', 'EHOSTDOWN', 'ENETDOWN']

/**
 * Checks if the error (or one of its causes) means that the connection to the node could not be established
 */
const isConnectError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false
  }

  const { code } = error as { code?: unknown }

  // ECONNRESET is a connect error only if the connection was reset during the TLS handshake,
  // otherwise it may happen after the request was sent
  return CONNECT_ERROR_CODES.includes(String(code)) ||
    (code === 'ECONNRESET' && error.message.includes('before secure TLS connection was established')) ||
    isConnectError(error.cause)
}

export const createClient = (url: string, abortController?: AbortController, fetch: typeof globalThis.fetch = fetchWithDetails): PlatformClient => {
  return new PlatformClient(new GrpcWebFetchTransport({
    baseUrl: url,
    abort: abortController?.signal,
    fetch
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
    const response = await withTimeout(async abortController => {
      const { response } = await createClient(url, abortController).getStatus(GetStatusRequest.create({}))

      return response
    })

    if (response.version.oneofKind !== 'v0') {
      return false
    }

    const { version, chain, time } = response.version.v0

    // node is still syncing
    if (chain == null || Boolean(chain.catchingUp)) {
      return false
    }

    // node runs a protocol version that is not supported by the SDK
    // (e.g. newer software with incompatible proofs / responses)
    const protocol = version?.protocol?.drive

    if (protocol == null || protocol.current !== Number(LATEST_PLATFORM_VERSION) || protocol.latest !== Number(LATEST_PLATFORM_VERSION)) {
      return false
    }

    // chain is stalled, last block is too old relative to the node's own clock
    // (local time is in seconds, block time is in milliseconds)
    if (time?.block == null || Number(time.local) * 1000 - Number(time.block) > HEALTHCHECK_MAX_BLOCK_AGE_MS) {
      return false
    }

    return true
  } catch (e) {
    return false
  }
}

// Fisher–Yates shuffle
// Randomly shuffles the elements inside of array, having previously cloned it.
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
  readonly retries: number
  #nodeIndex = 0
  #initialization?: Promise<void>
  // ban state of nodes that failed with a retryable error, banned nodes are skipped on node selection
  #bans = new Map<string, { bannedTimes: number, bannedUntil: number }>()
  // node that served (or is serving) the request of the client
  #clientNodes = new WeakMap<PlatformClient, string>()

  constructor (network: Network, grpcOptions?: GRPCOptions) {
    const retries = grpcOptions?.retries ?? GRPC_DEFAULT_CONNECT_RETRIES

    if (!Number.isInteger(retries) || retries < 0) {
      throw new Error(`GRPC retries must be a non-negative integer, got ${String(retries)}`)
    }

    this.network = network
    this.#poolLimit = grpcOptions?.poolLimit ?? GRPC_DEFAULT_POOL_LIMIT
    this.#dapiUrl = grpcOptions?.dapiUrl
    this.retries = retries

    // start initialization in the background, failures are reported on the first request
    this.#initialization = this.#initializePool()
    this.#initialization.catch(() => {})
  }

  async #initializePool (): Promise<void> {
    const { network } = this

    if (this.#dapiUrl != null) {
      if (typeof this.#dapiUrl !== 'string' && !Array.isArray(this.#dapiUrl)) {
        throw new Error('Unrecognized DAPI URL')
      }

      // trailing slash is removed, so the GRPC method path can be appended to the url
      this.dapiUrls = [...new Set([this.#dapiUrl].flat().map(url => url.replace(/\/+$/, '')))]

      if (this.dapiUrls.length === 0) {
        throw new Error('DAPI URL list is empty')
      }

      return
    }

    let quorumsInfo: CurrentQuorumsInfo | undefined
    const errors: unknown[] = []

    for (const seed of seedNodes[network]) {
      try {
        quorumsInfo = await withTimeout(async abortController =>
          await getCurrentQuorumsInfo({ network, getClient: () => createClient(seed, abortController) }))

        break
      } catch (e) {
        errors.push(e)
      }
    }

    if (quorumsInfo == null) {
      throw new AggregateError(errors, `None of the ${network} seed nodes are available: ${errors.map(String).join('; ')}`)
    }

    // map it to array of dapiUrls
    const networkDAPIUrls = shuffle([...new Set(quorumsInfo.validatorSets
      .flatMap(validatorSet => validatorSet.members)
      .filter(member => !member.isBanned)
      .map(member => `https://${member.nodeIp}:${DAPI_PORTS[network]}`))])

    // healthcheck nodes in parallel batches until the pool is full
    const dapiUrls: string[] = []

    for (let i = 0; i < networkDAPIUrls.length && dapiUrls.length < this.#poolLimit; i += this.#poolLimit) {
      const batch = networkDAPIUrls.slice(i, i + this.#poolLimit)
      const healthy = await Promise.all(batch.map(isNodeHealthy))

      dapiUrls.push(...batch.filter((_, j) => healthy[j]))
    }

    // fail the initialization, so it is retried on the next request
    if (dapiUrls.length === 0) {
      throw new Error(`None of the ${network} evonodes are available (${networkDAPIUrls.length} checked, ` +
        `nodes must be synced and run protocol version ${Number(LATEST_PLATFORM_VERSION)})`)
    }

    this.dapiUrls = dapiUrls.slice(0, this.#poolLimit)
  }

  /**
   * Waits for the pool initialization and returns a client connected to the next healthy node (round-robin)
   */
  async getClient (abortController?: AbortController): Promise<PlatformClient> {
    // retry initialization if the previous attempt failed
    this.#initialization ??= this.#initializePool()

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

    if (this.dapiUrls.length === 0) {
      throw new Error('DAPI URL list is empty')
    }

    const dapiUrl = this.#nextNode()

    if (dapiUrl == null) {
      throw new Error(`All ${this.dapiUrls.length} DAPI nodes are temporarily banned, no available nodes to send the request to`)
    }

    const client: PlatformClient = createClient(dapiUrl, abortController, this.#createFetchWithRetry(dapiUrl, url => this.#clientNodes.set(client, url)))

    this.#clientNodes.set(client, dapiUrl)

    return client
  }

  /**
   * Bans the node that served the request of the client, e.g. when it returned an invalid proof.
   * The first ban lasts 60 seconds, every next ban lasts e times longer, until the node is unbanned
   */
  banNode (client: PlatformClient): void {
    const url = this.#clientNodes.get(client)

    if (url != null) {
      this.#ban(url)
    }
  }

  /**
   * Unbans the node that served the request of the client and resets its ban period,
   * should be called once the response of the node was successfully verified
   */
  unbanNode (client: PlatformClient): void {
    const url = this.#clientNodes.get(client)

    if (url != null) {
      this.#bans.delete(url)
    }
  }

  #ban (url: string): void {
    // a single node is never banned, otherwise the pool would have no nodes to send requests to
    if (this.dapiUrls.length <= 1) {
      return
    }

    const bannedTimes = this.#bans.get(url)?.bannedTimes ?? 0

    this.#bans.set(url, {
      bannedTimes: bannedTimes + 1,
      bannedUntil: Date.now() + NODE_BASE_BAN_PERIOD_MS * Math.exp(bannedTimes)
    })
  }

  #isBanned (url: string): boolean {
    const ban = this.#bans.get(url)

    return ban != null && ban.bannedUntil > Date.now()
  }

  /**
   * Returns the next node from the pool in round-robin order, skipping the excluded and banned nodes.
   * Every request and every retry moves to the next node, so the load is spread evenly
   */
  #nextNode (exclude: string[] = []): string | undefined {
    for (let i = 0; i < this.dapiUrls.length; i++) {
      // index+1 and drop to 0 when #nodeIndex == this.dapiUrls.length
      const url = this.dapiUrls[this.#nodeIndex++ % this.dapiUrls.length]

      if (!exclude.includes(url) && !this.#isBanned(url)) {
        return url
      }
    }

    return undefined
  }

  /**
   * Creates a fetch for the client of the given node, that retries the request
   * on other nodes from the pool if it failed with a network error.
   * The failed node is banned, `onNodeChange` is called with the node the request is retried on
   */
  #createFetchWithRetry (dapiUrl: string, onNodeChange: (url: string) => void): typeof globalThis.fetch {
    return async (input, init) => {
      // transport always requests `${dapiUrl}/${service}/${method}`
      const methodPath = String(input).slice(dapiUrl.length)
      const triedUrls = [dapiUrl]
      let nodeUrl = dapiUrl

      for (let retry = 0; ; retry++) {
        try {
          return await fetchWithDetails(`${nodeUrl}${methodPath}`, init)
        } catch (e) {
          // state transition could already be received by the node,
          // so broadcast is retried only if the connection was not established
          const isRetryable = methodPath.includes('broadcast') ? isConnectError(e) : !isAbortError(e)

          if (!isRetryable || init?.signal?.aborted === true) {
            throw e
          }

          this.#ban(nodeUrl)

          if (retry >= this.retries) {
            throw e
          }

          await sleep(RETRY_DELAY_MS)

          const nextUrl = init?.signal?.aborted !== true ? this.#nextNode(triedUrls) : undefined

          if (nextUrl == null) {
            throw e
          }

          triedUrls.push(nextUrl)
          nodeUrl = nextUrl
          onNodeChange(nextUrl)
        }
      }
    }
  }
}
