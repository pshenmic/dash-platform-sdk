import { fetchWithDetails } from './fetchWithDetails.js'
import bytesToHex from './bytesToHex.js'
import hexToBytes from './hexToBytes.js'
import { QuorumKeyProvider, QuorumKeyRequest } from './verifyProofSignature.js'

/**
 * Default quorum key provider, fetches quorum public key from Platform Explorer API.
 * Note that it is a trusted third party, supply your own provider for trustless verification
 */
export const platformExplorerQuorumKeyProvider: QuorumKeyProvider = async (request: QuorumKeyRequest): Promise<Uint8Array | null> => {
  const { network, quorumType, quorumHash } = request

  const url = `https://${network === 'mainnet' ? '' : 'testnet.'}platform-explorer.pshenmic.dev/quorum/info?quorumType=${quorumType}&quorumHash=${bytesToHex(quorumHash)}`

  const resp = await fetchWithDetails(url, {
    method: 'GET'
  })

  if (resp.status === 404) {
    return null
  }

  if (resp.status !== 200) {
    throw new Error(`Failed to query Platform Explorer for quorum public keys (HTTP ${resp.status})`)
  }

  const { quorumPublicKey } = await resp.json()

  if (typeof quorumPublicKey !== 'string') {
    return null
  }

  return hexToBytes(quorumPublicKey)
}
