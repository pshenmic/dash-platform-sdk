import { MasternodeList } from '../types'

export default async function getEvonodeList (network: 'testnet' | 'mainnet'): Promise<MasternodeList> {
  const baseUrl: string = {
    testnet: 'https://trpc.digitalcash.dev',
    mainnet: 'https://rpc.digitalcash.dev'
  }[network]

  // let basicAuth = btoa(`user:pass`);
  const payload = JSON.stringify({
    method: 'masternodelist',
    params: [
      'evo'
    ]
  })

  const resp = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      // "Authorization": `Basic ${basicAuth}`,
      'Content-Type': 'application/json'
    },
    body: payload
  })

  const data = await resp.json()

  if (data.error != null) {
    const err = new Error(data.error.message)
    Object.assign(err, data.error)
    throw err
  }

  return data.result
}
