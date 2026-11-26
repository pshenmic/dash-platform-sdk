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
 * and falls back to the DCG quorum service when Platform Explorer is unavailable
 */
export class PlatformExplorerQuorumKeyProvider implements QuorumKeyProvider {
  network: Network
  #cache: Record<string, string> = {}

  constructor (network: Network) {
    this.network = network
  }

  async getQuorumPublicKey (quorumType: number, quorumHash: string): Promise<string> {
    const cacheKey = `${quorumType}_${quorumHash}`
    const cached = this.#cache[cacheKey]

    if (cached != null) {
      return cached
    }

    let platformExplorerError: unknown

    try {
      const quorumPublicKey = await this.#getPlatformExplorerQuorumPublicKey(quorumType, quorumHash)

      this.#cache[cacheKey] = quorumPublicKey

      return quorumPublicKey
    } catch (e) {
      platformExplorerError = e
    }

    try {
      const quorumPublicKey = await this.#getDCGQuorumPublicKey(quorumHash)

      this.#cache[cacheKey] = quorumPublicKey

      return quorumPublicKey
    } catch (e) {
      throw new AggregateError(
        [platformExplorerError, e],
        `Failed to query quorum public key for quorum ${quorumHash} (type ${quorumType}) from Platform Explorer and DCG quorum service`
      )
    }
  }

  async #getPlatformExplorerQuorumPublicKey (quorumType: number, quorumHash: string): Promise<string> {
    const url = `https://${this.network === 'mainnet' ? '' : 'testnet.'}platform-explorer.pshenmic.dev/quorum/info?quorumType=${quorumType}&quorumHash=${quorumHash}`

    const resp = await fetchWithDetails(url, {
      method: 'GET'
    })

    if (resp.status !== 200) {
      throw new Error(`Platform Explorer responded with HTTP ${resp.status}`)
    }

    const { quorumPublicKey }: { quorumPublicKey?: string } = await resp.json()

    if (typeof quorumPublicKey !== 'string') {
      throw new Error('Platform Explorer response does not contain quorum public key')
    }

    return quorumPublicKey
  }

  async #getDCGQuorumPublicKey (quorumHash: string): Promise<string> {
    const url = `https://quorums.${this.network}.networks.dash.org/quorums/${quorumHash}`

    const resp = await fetchWithDetails(url, {
      method: 'GET'
    })

    if (resp.status !== 200) {
      throw new Error(`DCG quorum service responded with HTTP ${resp.status}`)
    }

    const { success, data, message }: { success?: boolean, data?: { key?: string } | null, message?: string | null } = await resp.json()

    if (success !== true || typeof data?.key !== 'string') {
      throw new Error(`DCG quorum service did not return quorum public key${message != null ? `: ${message}` : ''}`)
    }

    return data.key
  }
}
