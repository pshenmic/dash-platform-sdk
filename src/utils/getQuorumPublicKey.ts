const cache: {
  [key: string]: string
} = {}

export async function getQuorumPublicKey (network: string, quorumType: number, quorumHash: string): Promise<string> {
  const cached = cache[`${quorumType}_${quorumHash}`]

  if (cached != null) {
    return cached
  }

  const url = `https://${network === 'mainnet' ? '' : 'testnet.'}platform-explorer.pshenmic.dev/quorumPublicKey?quorumType=${quorumType}&quorumHash=${quorumHash}`

  const resp = await fetch(url, {
    method: 'GET'
  })

  if (resp.status !== 200) {
    throw new Error('Failed to query Platform Explorer for quorum public keys')
  }

  const data = await resp.json()

  const { quorumPublicKey } = data

  cache[`${quorumType}_${quorumHash}`] = quorumPublicKey

  return quorumPublicKey
}
