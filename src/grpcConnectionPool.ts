import getRandomArrayItem from './utils/getRandomArrayItem'
import { Channel, Client, createChannel, createClient } from 'nice-grpc-web'
import { GetStatusRequest, GetStatusResponse, PlatformDefinition } from '../proto/generated/platform'
import getEvonodeList from './utils/getEvonodeList'
import { GRPC_DEFAULT_POOL_LIMIT } from './constants'
import { GRPCOptions } from './DashPlatformSDK'

const seedNodes = {
  testnet: [
    // seed-1.pshenmic.dev
    'https://158.160.14.115:1443'
  ],
  mainnet: [
    // seed-1.pshenmic.dev
    'https://158.160.14.115:443',
    // mainnet dcg seeds
    // 'https://158.160.14.115',
    // 'https://3.0.60.103',
    // 'https://34.211.174.194'
  ]
}

export default class GRPCConnectionPool {
  channels: Channel[]
  network: string

  constructor (network: 'testnet' | 'mainnet', grpcOptions?: GRPCOptions) {
    const grpcPoolLimit = grpcOptions?.poolLimit ?? GRPC_DEFAULT_POOL_LIMIT

    this.network = network

    this._initialize(network, grpcPoolLimit, grpcOptions?.dapiUrl).catch(console.error)
  }

  async _initialize (network: 'testnet' | 'mainnet', poolLimit: number, dapiUrl?: string | string[]): Promise<void> {
    if (typeof dapiUrl === 'string') {
      this.channels = [createChannel(dapiUrl)]

      return
    }

    if (Array.isArray(dapiUrl)) {
      this.channels = dapiUrl.map(dapiUrl => createChannel(dapiUrl))

      return
    }

    if (dapiUrl != null) {
      throw new Error('Unrecognized DAPI URL')
    }

    // Add default seed nodes
    this.channels = (seedNodes[network].map((dapiUrl: string) => createChannel(dapiUrl)))

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
      if (this.channels.length > poolLimit) {
        break
      }

      try {
        const channel = createChannel(url)
        const client = createClient(PlatformDefinition, channel)
        const response: GetStatusResponse = await client.getStatus(GetStatusRequest.fromPartial({ v0: {} }))
        const { v0 } = response

        if (v0?.chain != null) {
          this.channels.push(createChannel(url))
        }
      } catch (e) {
      }
    }
  }

  getClient (): Client<PlatformDefinition> {
    const channel = getRandomArrayItem(this.channels)
    console.log(channel)
    return createClient(PlatformDefinition, channel)
  }
}
