import { fetchWithDetails } from './utils/fetchWithDetails.js'
import { Network } from '../types.js'

/**
 * Source of quorum public keys used to verify proof signatures.
 * Implement it to supply keys from your own source (SPV client, local Dash Core node, etc.)
 */
export interface QuorumKeyProvider {
  /**
   * @param quorumType {number} LLMQ type of the quorum
   * @param quorumHash {string} hex of proof.quorumHash bytes, same as in Dash Core RPC (`quorum info`)
   *
   * @return {Promise<string>} BLS public key of the quorum in hex
   */
  getQuorumPublicKey: (quorumType: number, quorumHash: string) => Promise<string>
}

/**
 * Default quorum key provider, fetches quorum public keys from Platform Explorer API
 */
export class PlatformExplorerQuorumKeyProvider implements QuorumKeyProvider {
  network: Network
  #cache: Record<string, string> = {}

  constructor (network: Network) {
    this.network = network
  }

  async getQuorumPublicKey (quorumType: number, quorumHash: string): Promise<string> {
    const cached = this.#cache[`${quorumType}_${quorumHash}`]

    if (cached != null) {
      return cached
    }

    const url = `https://${this.network === 'mainnet' ? '' : 'testnet.'}platform-explorer.pshenmic.dev/quorum/info?quorumType=${quorumType}&quorumHash=${quorumHash}`

    const resp = await fetchWithDetails(url, {
      method: 'GET'
    })

    if (resp.status !== 200) {
      throw new Error('Failed to query Platform Explorer for quorum public keys')
    }

    const data = await resp.json()

    const { quorumPublicKey } = data

    this.#cache[`${quorumType}_${quorumHash}`] = quorumPublicKey

    return quorumPublicKey
  }
}
