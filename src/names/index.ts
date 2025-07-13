import search from './search'
import GRPCConnectionPool from '../grpcConnectionPool'
import { DocumentWASM } from 'pshenmic-dpp'

/**
 * Functions related to DPNS names (usernames)
 *
 * @hideconstructor
 */
export class NamesController {
  /** @ignore **/
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  /**
   * Searches for a registered DPNS name in the network
   *
   * Should be in a human-readable format, for example pshenmic.dash
   *
   * Returns a {DocumentWASM} document of type 'domain' from DPNS system data contract if found,
   * returns null if not found.
   *
   * https://testnet.platform-explorer.com/dataContract/GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec?tab=schema
   *
   * @param name {string}
   *
   * @return Promise<DocumentWASM | null>
   */
  async search (name: string): Promise<DocumentWASM | null> {
    if (typeof name !== 'string' || name.split('.').length !== 2) {
      throw new Error('Name to search must be in username.dash format')
    }

    const [label, parentDomainName] = name.split('.')

    if (parentDomainName !== 'dash') {
      throw new Error('Root domain must be .dash')
    }

    const [document] = await search(this.grpcPool, label, parentDomainName)

    if (document == null) {
      return null
    }

    return document
  }
}
