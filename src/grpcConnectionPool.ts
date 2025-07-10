import getRandomArrayItem from './utils/getRandomArrayItem'
import { Channel, Client, createChannel, createClient } from 'nice-grpc-web'
import {DeepPartial, MessageFns, PlatformDefinition} from '../proto/generated/platform'
import getEvonodeList from './utils/getEvonodeList'

const seedNodes = {
  testnet: [
    'https://54.201.32.131:1443',
    'https://52.42.202.128:1443',
    'https://52.40.219.41:1443',
    'https://52.89.154.48:1443',
    'https://52.34.144.50:1443'
  ],
  mainnet: [
    'https://149.202.78.214',
    'https://52.10.213.198',
    'https://194.163.166.185',
    'https://66.70.170.22',
    'https://31.220.85.180'
  ]
}

export default class GRPCConnectionPool {
  channels: Channel[]

  constructor (network: 'testnet' | 'mainnet', dapiUrl?: string) {
    if (typeof dapiUrl === 'string') {
      this.channels = [createChannel(dapiUrl)]
    } else {
      this.channels = seedNodes[network].map((dapiUrl: string) => createChannel(dapiUrl))

      getEvonodeList(network)
        .then((evonodeList) => {
          const evonodeListDapiURLs = Object
            .entries(evonodeList)
            .map(([, info]) => info)
            .filter((info: any) => info.status === 'ENABLED')
            .map((info: any) => {
              const [host] = info.address.split(':')

              return `https://${host as string}:${info.platformHTTPPort as number}`
            })

          this.channels = evonodeListDapiURLs.map(dapiUrl => createChannel(dapiUrl))
        })
        .catch(console.error)
    }
  }

  getClient (): Client<PlatformDefinition> {
    const channel = getRandomArrayItem(this.channels)
    return createClient(PlatformDefinition, channel)
  }

  async call<ReqType, Out, Req>(method: {
    requestType: ReqType,
    responseType: MessageFns<Out>,
    name: string
  }, request: Req): Promise<DeepPartial<Out>> {
    try {
      const client = this.getClient()

      return client[method.name](request)

    } catch (e) {
      // request error handling
      throw new Error(e);
    }
  }
}
