import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { PlatformClient } from '../proto/generated/platform.client.js'
import { GetStatusRequest } from '../proto/generated/platform.js'
import getCurrentQuorumsInfo from './node/getCurrentQuorumsInfo.js'
import getRandomArrayItem from './utils/getRandomArrayItem.js'
import { Network } from '../types.js'
import { fetchWithDetails } from './utils/fetchWithDetails.js'

const GRPC_DEFAULT_POOL_LIMIT = 5
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
  getClient: (abortController?: AbortController) => PlatformClient
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
    'https://158.160.14.115:1443',
    'https://62.84.119.150:1443',
    // validator
    'https://68.67.122.26:1443'
  ],
  mainnet: [
    // seed-1.pshenmic.dev
    'https://158.160.14.115:443',
    'https://62.84.119.150:443',
    // validator
    'https://95.216.146.18:443',
    // mainnet dcg seeds
    // 'https://158.160.14.115',
    // 'https://3.0.60.103',
    // 'https://34.211.174.194'
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

export default class GRPCConnectionPool implements GRPCPool {
  dapiUrls: string[]
  network: Network
  #initialization: Promise<void>

  constructor (network: Network, grpcOptions?: GRPCOptions) {
    const grpcPoolLimit = grpcOptions?.poolLimit ?? GRPC_DEFAULT_POOL_LIMIT

    this.network = network

    this.#initialization = this._initialize(network, grpcPoolLimit, grpcOptions?.dapiUrl).catch(console.error)
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

    // Add default seed nodes
    this.dapiUrls = [...seedNodes[network]]

    // retrieve evonodes from current validator sets through the first responding seed node,
    // seed nodes that failed to respond are removed from the pool
    const seedRequests = seedNodes[network].map(async seed => {
      try {
        return await getCurrentQuorumsInfo({ network, getClient: () => createClient(seed) })
      } catch (e) {
        this.dapiUrls = this.dapiUrls.filter(url => url !== seed)

        throw e
      }
    })

    const { validatorSets } = await Promise.any(seedRequests)

    // map it to array of dapiUrls
    const networkDAPIUrls = [...new Set(validatorSets
      .flatMap(validatorSet => validatorSet.members)
      .filter(member => !member.isBanned)
      .map(member => `https://${member.nodeIp}:${DAPI_PORTS[network]}`))]

    // healthcheck nodes
    for (const url of networkDAPIUrls) {
      if (this.dapiUrls.length > poolLimit) {
        break
      }

      try {
        const client = createClient(url)

        const { response } = await client.getStatus(GetStatusRequest.create({}))

        if (response.version.oneofKind === 'v0' && response.version.v0.chain != null) {
          this.dapiUrls.push(url)
        }
      } catch (e) {
      }
    }

    // wait until every seed node responded or failed, so dead ones are removed from the pool
    await Promise.allSettled(seedRequests)
  }

  /**
   * Resolves when the pool initialization (seed nodes check and evonodes discovery) is finished
   */
  async waitForInit (): Promise<void> {
    await this.#initialization
  }

  getClient (abortController?: AbortController): PlatformClient {
    const dapiUrl = getRandomArrayItem(this.dapiUrls)

    return createClient(dapiUrl, abortController)
  }
}
