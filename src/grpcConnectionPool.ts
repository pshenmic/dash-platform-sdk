import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { PlatformClient } from '../proto/generated/platform.client.js'
import getEvonodeList from './utils/getEvonodeList.js'
import { GetStatusRequest } from '../proto/generated/platform.js'
import getRandomArrayItem from './utils/getRandomArrayItem.js'
import { Network } from '../types.js'

const GRPC_DEFAULT_POOL_LIMIT = 5
export type MasternodeList = Record<string, MasternodeInfo>
export interface GRPCOptions {
  poolLimit: 5
  dapiUrl?: string | string[]
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
    'https://158.160.14.115:1443'
  ],
  mainnet: [
    // seed-1.pshenmic.dev
    'https://158.160.14.115:443'
    // mainnet dcg seeds
    // 'https://158.160.14.115',
    // 'https://3.0.60.103',
    // 'https://34.211.174.194'
  ]
}

const createClient = (url: string, abortController?: AbortController): PlatformClient => {
  return new PlatformClient(new GrpcWebFetchTransport({
    baseUrl: url,
    abort: abortController?.signal
  }))
}

export default class GRPCConnectionPool {
  dapiUrls: string[]
  network: Network

  constructor (network: Network, grpcOptions?: GRPCOptions) {
    const grpcPoolLimit = grpcOptions?.poolLimit ?? GRPC_DEFAULT_POOL_LIMIT

    this.network = network

    this._initialize(network, grpcPoolLimit, grpcOptions?.dapiUrl).catch(console.error)
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
    this.dapiUrls = seedNodes[network]

    // retrieve last evonodes list
    const evonodeList = await getEvonodeList(network)

    // map it to array of dapiUrls
    const networkDAPIUrls = Object.entries(evonodeList)
      .map(([, info]) => info)
      .filter((info: any) => info.status === 'ENABLED')
      .map((info: any) => {
        const [host] = info.address.split(':')

        return `https://${host as string}:${info.platformHTTPPort as number}`
      })

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
  }

  getClient (abortController?: AbortController): PlatformClient {
    const dapiUrl = getRandomArrayItem(this.dapiUrls)

    return createClient(dapiUrl, abortController)
  }
}
