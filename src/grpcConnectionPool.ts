import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { PlatformClient } from '../proto/generated/platform.client.js'
import { GetStatusRequest } from '../proto/generated/platform.js'
import getCurrentQuorumsInfo, { CurrentQuorumsInfo } from './node/getCurrentQuorumsInfo.js'
import { Network } from '../types.js'
import { fetchWithDetails } from './utils/fetchWithDetails.js'
import { LATEST_PLATFORM_VERSION, MIN_PROTOCOL_VERSION } from './constants.js'
import sleep from './utils/sleep.js'

const GRPC_DEFAULT_POOL_LIMIT = 15
const GRPC_DEFAULT_CONNECT_RETRIES = 5
// first ban lasts 60 seconds, every next ban without a successful request in between lasts e times longer
const NODE_BASE_BAN_PERIOD_MS = 60 * 1000
const RETRY_DELAY_MS = 10
const GRPC_DEFAULT_REQUEST_TIMEOUT_MS = 10 * 1000

export interface GRPCOptions {
  poolLimit?: number
  dapiUrl?: string | string[]
  retries?: number
  /**
   * Deadline of a single request attempt in milliseconds, the request is aborted and retried on another node when it expires.
   * Streams and long-polling requests are not limited by it. Default is 10 seconds
   */
  requestTimeout?: number
  /**
   * Minimal protocol version of the nodes, nodes with the protocol version from `minProtocolVersion` up to the latest
   * version supported by the SDK are used. By default, nodes with any protocol version up to the latest one are used.
   * The SDK starts with the higher of it and the lowest version the network runs, see {GRPCPool.protocolVersion}
   */
  minProtocolVersion?: number
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
  /** Requests and verifies proofs of the queries, `true` if not set **/
  proofs?: boolean
  /**
   * Protocol version used to verify proofs and to parse responses, the lowest version the network runs if not set.
   * Raised by the SDK to the protocol version of the responses whose proof and quorum signature were verified,
   * it is never lowered and versions unknown to the SDK are ignored
   */
  protocolVersion?: number
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
    'https://seed-1.testnet.networks.dash.org:1443',
    // Testnet validator
    'https://68.67.122.1:1443'
  ],
  mainnet: [
    // seed-1.pshenmic.dev
    'https://153.80.206.97:443',
    // DCG seed
    'https://seed-1.mainnet.networks.dash.org:443',
    // validator
    'https://95.216.146.18:443'
  ]
}

const DAPI_PORTS = {
  testnet: 1443,
  mainnet: 443
}

// Initialization is optimistic: the seeds are used right away and the first real request is the
// healthcheck. A failed node is banned and the request is retried on another one by the fetch
// wrapper, so there is no need to probe every seed before serving a query.
//
// Validator discovery runs in small waves after the first successful request, so it never delays
// or competes with the first queries. Discovered validators are still healthchecked before they
// replace the seeds, so the long-lived pool does not fill up with slow or lagging nodes.
const SEED_DISCOVERY_BATCH = 4
const SEED_DISCOVERY_WAVES = 2
const SEED_DISCOVERY_TIMEOUT_MS = 3000
const SEED_DISCOVERY_DELAY_MS = 2500

// Only a handful of seeds is checked before the first request. Resolving at the first two
// healthy nodes keeps the initial pool small and known-good, instead of spraying the first
// parallel batch over every seed (including dead or slow ones).
const BOOTSTRAP_SEED_COUNT = 6
const BOOTSTRAP_TIMEOUT_MS = 2500
const BOOTSTRAP_MIN_HEALTHY = 2

const VALIDATOR_CHECK_TIMEOUT_MS = 5000
// platform produces empty blocks every 3 minutes, so a healthy chain is never older than that
const VALIDATOR_CHECK_MAX_BLOCK_AGE_MS = 10 * 60 * 1000

// Per-client concurrency × clients initializing at once is the instantaneous load on nodes,
// so healthchecks run a small window at a time to avoid a fleet-wide request burst.
const VALIDATOR_CHECK_CONCURRENCY = 2
// The pool keeps serving requests with the seeds until this many validators are healthy.
const VALIDATOR_CHECK_MIN_HEALTHY = 2

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
const withTimeout = async <T>(request: (abortController: AbortController) => Promise<T>, timeoutMs = SEED_DISCOVERY_TIMEOUT_MS): Promise<T> => {
  const abortController = new AbortController()
  let timeout: ReturnType<typeof setTimeout> | undefined

  try {
    // Race with a rejection as well: aborting a fetch is not guaranteed to settle the
    // promise, e.g. while the TLS handshake is stuck, and init must never hang.
    return await Promise.race([
      request(abortController),
      new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(() => {
          abortController.abort()
          reject(new Error(`Request timed out after ${timeoutMs}ms`))
        }, timeoutMs)
      })
    ])
  } finally {
    if (timeout != null) {
      clearTimeout(timeout)
    }
  }
}

/**
 * Runs the callback after a short delay, without blocking the first requests.
 * A timer is used (instead of requestIdleCallback) so discovery still happens when the
 * page keeps making requests and never goes idle.
 */
const later = (callback: () => void): void => {
  setTimeout(callback, SEED_DISCOVERY_DELAY_MS)
}

const isNodeHealthy = async (url: string, minProtocolVersion?: number, signal?: AbortSignal, timeoutMs = VALIDATOR_CHECK_TIMEOUT_MS): Promise<boolean> => {
  try {
    const response = await withTimeout(async abortController => {
      signal?.addEventListener('abort', () => abortController.abort())

      const { response } = await createClient(url, abortController).getStatus(GetStatusRequest.create({}))

      return response
    }, timeoutMs)

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

    if (protocol == null) {
      return false
    }

    // the protocol version of the network is learned from the verified responses, so nodes of any supported version are used
    if (protocol.current < (minProtocolVersion ?? 1) || protocol.current > Number(LATEST_PLATFORM_VERSION)) {
      return false
    }

    // chain is stalled, last block is too old relative to the node's own clock
    // (local time is in seconds, block time is in milliseconds)
    if (time?.block == null || Number(time.local) * 1000 - Number(time.block) > VALIDATOR_CHECK_MAX_BLOCK_AGE_MS) {
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
  #minProtocolVersion?: number
  readonly retries: number
  readonly requestTimeout: number
  proofs?: boolean
  protocolVersion: number
  #nodeIndex = 0
  #initialization?: Promise<void>
  #discoveryScheduled = false
  // Known seeds that are not in the active pool yet, used only when the active nodes fail
  #fallbackUrls: string[] = []
  // ban state of nodes that failed with a retryable error, banned nodes are skipped on node selection
  #bans = new Map<string, { bannedTimes: number, bannedUntil: number }>()
  // node that served (or is serving) the request of the client
  #clientNodes = new WeakMap<PlatformClient, string>()

  constructor (network: Network, grpcOptions?: GRPCOptions) {
    const retries = grpcOptions?.retries ?? GRPC_DEFAULT_CONNECT_RETRIES

    if (!Number.isInteger(retries) || retries < 0) {
      throw new Error(`GRPC retries must be a non-negative integer, got ${String(retries)}`)
    }

    const requestTimeout = grpcOptions?.requestTimeout ?? GRPC_DEFAULT_REQUEST_TIMEOUT_MS

    if (!Number.isInteger(requestTimeout) || requestTimeout <= 0) {
      throw new Error(`GRPC requestTimeout must be a positive integer, got ${String(requestTimeout)}`)
    }

    const minProtocolVersion = grpcOptions?.minProtocolVersion

    if (minProtocolVersion != null && (!Number.isInteger(minProtocolVersion) || minProtocolVersion < 1 || minProtocolVersion > Number(LATEST_PLATFORM_VERSION))) {
      throw new Error(`GRPC minProtocolVersion must be an integer from 1 to ${Number(LATEST_PLATFORM_VERSION)}, got ${String(minProtocolVersion)}`)
    }

    this.#minProtocolVersion = minProtocolVersion
    // nodes run at least `minProtocolVersion`, but the SDK never starts below the lowest version the network runs
    this.protocolVersion = Math.max(minProtocolVersion ?? 0, MIN_PROTOCOL_VERSION[network])
    this.network = network
    this.#poolLimit = grpcOptions?.poolLimit ?? GRPC_DEFAULT_POOL_LIMIT
    this.#dapiUrl = grpcOptions?.dapiUrl
    this.retries = retries
    this.requestTimeout = requestTimeout

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

    // Start with the primary seed right away. The first request doubles as the healthcheck and
    // failing nodes are retried from the fallback list below, so init never waits for a network
    // round trip. Healthy seeds are appended in the background to give the pool some fan-out.
    const seeds = [seedNodes[network][0], ...shuffle(seedNodes[network].slice(1))]
    this.dapiUrls = [seeds[0]]
    this.#fallbackUrls = seeds.slice(1)

    void this.#bootstrapSeeds(seeds.slice(0, BOOTSTRAP_SEED_COUNT)).then(healthySeeds => {
      for (const url of healthySeeds) {
        if (!this.dapiUrls.includes(url)) {
          this.dapiUrls.push(url)
        }
      }
    }).catch(() => {
      // keep serving from the primary seed and the fallback list
    })
  }

  /**
   * Races a small set of seeds and resolves at the first two healthy ones.
   * A slow seed cannot hold initialization: the race aborts as soon as enough nodes are found.
   */
  async #bootstrapSeeds (candidates: string[]): Promise<string[]> {
    const healthySeeds: string[] = []

    if (candidates.length === 0) {
      return healthySeeds
    }

    const race = new AbortController()
    let deadline: ReturnType<typeof setTimeout> | undefined
    // Once the race is decided, late responses must not change the bootstrap set
    let settled = false

    try {
      await Promise.race([
        new Promise<void>(resolve => {
          let pending = candidates.length

          for (const seed of candidates) {
            void isNodeHealthy(seed, this.#minProtocolVersion, race.signal, BOOTSTRAP_TIMEOUT_MS).then(healthy => {
              if (settled) {
                return
              }

              if (healthy) {
                healthySeeds.push(seed)

                if (healthySeeds.length >= BOOTSTRAP_MIN_HEALTHY) {
                  settled = true
                  race.abort()
                  resolve()
                  return
                }
              }

              pending -= 1
              if (pending === 0) {
                settled = true
                resolve()
              }
            })
          }
        }),
        // Hard deadline: init resolves with whatever healthy seeds were found, even if a
        // node connection never settles after the abort.
        new Promise<void>(resolve => {
          deadline = setTimeout(resolve, BOOTSTRAP_TIMEOUT_MS + 500)
        })
      ])
    } finally {
      settled = true
      race.abort()

      if (deadline != null) {
        clearTimeout(deadline)
      }
    }

    return [...healthySeeds]
  }

  /**
   * Starts validator discovery once, after the first request had a chance to complete.
   * It is a background job: the pool keeps serving requests from the seeds meanwhile.
   */
  #scheduleDiscovery (): void {
    if (this.#discoveryScheduled || this.#dapiUrl != null) {
      return
    }

    this.#discoveryScheduled = true

    later(() => {
      void this.#discoverValidators().catch(() => {
        // keep using the seeds if discovery fails
      })
    })
  }

  /**
   * Fetches the current validator set, healthchecks its nodes and replaces the seeds with
   * the healthy validators. The checks run here, off the critical path, so the first requests
   * are never delayed by them and the long-lived pool does not fill up with lagging nodes.
   */
  async #discoverValidators (): Promise<void> {
    const { network } = this
    const quorumsInfo = await this.#fetchQuorumsInfo()
    const validators = shuffle([...new Set(quorumsInfo.validatorSets
      .flatMap(validatorSet => validatorSet.members)
      .filter(member => !member.isBanned)
      .map(member => `https://${member.nodeIp}:${DAPI_PORTS[network]}`))])

    if (validators.length === 0) {
      return
    }

    const healthyValidators: string[] = []
    let validatorIndex = 0

    const checkValidator = async (): Promise<void> => {
      while (validatorIndex < validators.length && healthyValidators.length < this.#poolLimit) {
        const url = validators[validatorIndex++]

        if (await isNodeHealthy(url, this.#minProtocolVersion)) {
          healthyValidators.push(url)

          // Replace the seeds once enough validators are healthy, so a single slow node
          // cannot hold the whole pool. Otherwise the seeds stay as a fallback.
          if (healthyValidators.length >= VALIDATOR_CHECK_MIN_HEALTHY) {
            this.dapiUrls = healthyValidators.slice(0, this.#poolLimit)
          }
        }
      }
    }

    await Promise.all(Array.from({ length: VALIDATOR_CHECK_CONCURRENCY }, async () => await checkValidator()))
  }

  /**
   * Reads the current quorums info from the first responding seed. Seeds are tried in small
   * waves, so a single round of discovery does not send a request to every seed at once.
   */
  async #fetchQuorumsInfo (): Promise<CurrentQuorumsInfo> {
    const seeds = shuffle([...seedNodes[this.network]])
    const maxSeeds = Math.min(seeds.length, SEED_DISCOVERY_BATCH * SEED_DISCOVERY_WAVES)
    let lastError: unknown

    for (let i = 0; i < maxSeeds; i += SEED_DISCOVERY_BATCH) {
      const batch = seeds.slice(i, i + SEED_DISCOVERY_BATCH)
      const winner = new AbortController()

      try {
        return await Promise.any(batch.map(async seed =>
          await withTimeout(async abortController => {
            winner.signal.addEventListener('abort', () => abortController.abort())

            return await getCurrentQuorumsInfo({ network: this.network, getClient: () => createClient(seed, abortController) })
          })))
      } catch (e) {
        lastError = e
      } finally {
        winner.abort()
      }
    }

    const errors = (lastError as AggregateError | undefined)?.errors ?? [lastError]
    throw new AggregateError(errors, `None of the ${this.network} seed nodes are available: ${errors.map(String).join('; ')}`)
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
    if (this.dapiUrls.length + this.#fallbackUrls.length <= 1) {
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

    // Every active node is banned or already tried: promote a fallback seed into the pool.
    // This keeps the first batch on the primary node while preserving failover.
    const fallback = this.#fallbackUrls.find(url => !exclude.includes(url) && !this.#isBanned(url))

    if (fallback != null) {
      this.#fallbackUrls = this.#fallbackUrls.filter(url => url !== fallback)
      this.dapiUrls.push(fallback)
      return fallback
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
      // streams and long-polls wait for the node as long as it takes and are aborted only by the caller's signal
      const hasDeadline = !methodPath.includes('subscribe') && !methodPath.includes('waitForStateTransitionResult')
      const outerSignal = init?.signal
      const triedUrls = [dapiUrl]
      let nodeUrl = dapiUrl

      for (let retry = 0; ; retry++) {
        const abortController = hasDeadline ? new AbortController() : undefined
        const onOuterAbort = (): void => abortController?.abort()
        const timeout = hasDeadline ? setTimeout(() => abortController?.abort(), this.requestTimeout) : undefined

        if (abortController != null) {
          outerSignal?.addEventListener('abort', onOuterAbort)

          if (outerSignal?.aborted === true) {
            abortController.abort()
          }
        }

        try {
          const response = await fetchWithDetails(`${nodeUrl}${methodPath}`, abortController != null ? { ...init, signal: abortController.signal } : init)

          // a successful request resets the ban escalation of the node
          this.#bans.delete(nodeUrl)

          // The first served request doubles as the seed healthcheck; start the
          // background validator discovery only after it succeeded.
          this.#scheduleDiscovery()

          return response
        } catch (e) {
          // the deadline abort is retryable, the caller's abort is not
          const timedOut = abortController?.signal.aborted === true && outerSignal?.aborted !== true
          // surface the expired deadline as a timeout error instead of a bare abort
          const error = timedOut
            ? Object.assign(new Error(`Request timed out after ${this.requestTimeout}ms`, { cause: e }), { name: 'TimeoutError' })
            : e
          // state transition could already be received by the node,
          // so broadcast is retried only if the connection was not established
          const isRetryable = methodPath.includes('broadcast') ? isConnectError(e) : (!isAbortError(e) || timedOut)

          if (!isRetryable || outerSignal?.aborted === true) {
            throw error
          }

          this.#ban(nodeUrl)

          if (retry >= this.retries) {
            throw error
          }

          await sleep(RETRY_DELAY_MS)

          const nextUrl = outerSignal?.aborted !== true ? this.#nextNode(triedUrls) : undefined

          if (nextUrl == null) {
            throw error
          }

          triedUrls.push(nextUrl)
          nodeUrl = nextUrl
          onNodeChange(nextUrl)
        } finally {
          clearTimeout(timeout)

          if (abortController != null) {
            outerSignal?.removeEventListener('abort', onOuterAbort)
          }
        }
      }
    }
  }
}
