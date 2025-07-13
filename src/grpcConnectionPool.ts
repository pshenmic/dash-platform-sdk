import getRandomArrayItem from './utils/getRandomArrayItem'
import { Channel, Client, createChannel, createClient } from 'nice-grpc-web'
import { PlatformDefinition } from '../proto/generated/platform'
import getEvonodeList from './utils/getEvonodeList'

const seedNodes = {
  testnet: [
    // seed-1.pshenmic.dev
    'https://158.160.14.115:1443'
  ],
  mainnet: [
    // seed-1.pshenmic.dev
    'https://158.160.14.115:443',
    // mainnet dcg seeds
    'https://158.160.14.115',
    'https://3.0.60.103',
    'https://34.211.174.194'
  ]
}

export default class GRPCConnectionPool {
  channels: Channel[]

  constructor (network: 'testnet' | 'mainnet', dapiUrl?: string | string[]) {
    if (dapiUrl == null) {
      this.channels = seedNodes[network].map((dapiUrl: string) => createChannel(dapiUrl))

      // todo refactor to stream
      this._loadRecentEvonodeList(network)
        .catch(console.error)

      return
    }

    if (typeof dapiUrl === 'string') {
      this.channels = [createChannel(dapiUrl)]
    } else if (Array.isArray(dapiUrl)) {
      this.channels = dapiUrl.map(dapiUrl => createChannel(dapiUrl))
    } else {
      throw new Error('Invalid dapiUrl')
    }
  }

  async _loadRecentEvonodeList (network: 'testnet' | 'mainnet'): Promise<string[]> {
    // retrieve last evonodes list
    const evonodeList = await getEvonodeList(network)

    // map to array of urls
    const allDAPIUrls = Object.entries(evonodeList)
      .map(([, info]) => info)
      .filter((info: any) => info.status === 'ENABLED')
      .map((info: any) => {
        const [host] = info.address.split(':')

        return `https://${host as string}:${info.platformHTTPPort as number}`
      })

    // healthcheck the DAPI
    const results = await Promise.allSettled(allDAPIUrls.map(async (dapiUrl) => {
      await fetch(dapiUrl)

      return dapiUrl
    }))

    const healthchecked = results.filter(result => result.status === 'fulfilled').map(result => result.value)
    const dapiUrls = [...seedNodes[network], ...healthchecked]

    this.channels = dapiUrls.map((dapiUrl: string) => createChannel(dapiUrl))

    return dapiUrls
  }

  getClient (): Client<PlatformDefinition> {
    const channel = getRandomArrayItem(this.channels)
    return createClient(PlatformDefinition, channel)
  }
}
