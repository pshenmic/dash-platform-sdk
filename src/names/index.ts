import GRPCConnectionPool from '../grpcConnectionPool'
import { DocumentWASM, IdentifierWASM, PrivateKeyWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'
import searchByName from './searchByName'
import searchByIdentity from './searchByIdentity'
import registerName from './registerName'
import validateName from './validateName'
import getIdentityByIdentifier from '../identities/getIdentityByIdentifier'

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
  async searchByName (name: string): Promise<DocumentWASM[]> {
    const validation = validateName(name)

    if (validation != null) {
      throw new Error(validation)
    }

    return await searchByName(this.grpcPool, name)
  }

  async searchByIdentity (identifier: IdentifierLike): Promise<DocumentWASM[]> {
    return await searchByIdentity(this.grpcPool, new IdentifierWASM(identifier))
  }

  async registerName (name: string, identityId: IdentifierLike, privateKey: PrivateKeyWASM, preorderSalt?: Uint8Array): Promise<void> {
    const validation = validateName(name)

    if (validation != null) {
      throw new Error(validation)
    }

    if (preorderSalt != null && preorderSalt.length !== 32) {
      throw new Error('Preorder salt must be a 32 length')
    }

    const identity = await getIdentityByIdentifier(this.grpcPool, identityId)

    await registerName(this.grpcPool, name, identity, privateKey, preorderSalt)
  }
}
