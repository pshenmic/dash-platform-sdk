import GRPCConnectionPool from '../grpcConnectionPool.js'
import { DocumentWASM, IdentifierWASM, PrivateKeyWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types.js'
import searchByName from './searchByName.js'
import searchByIdentity from './searchByIdentity.js'
import registerName from './registerName.js'
import validateName from './validateName.js'
import getIdentityByIdentifier from '../identities/getIdentityByIdentifier.js'
import convertToHomographSafeChars from '../utils/convertToHomographSafeChars.js'
import testNameContested from './testNameContested.js'

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

  /**
   * Tests a given username against contested names rules.
   * Contested names includes an additional fee of 0.2 Dash
   * as a voting resolution fee
   *
   * This function return boolean whether given username (f.e pshenmic.dash)
   * falls under contested names rules.
   * @param name
   */
  testNameContested (name: string): boolean {
    const validation = validateName(name)

    if (validation != null) {
      throw new Error(validation)
    }

    const [label] = name.split('.')

    const normalizedLabel = convertToHomographSafeChars(label)

    return testNameContested(normalizedLabel)
  }

  async searchByIdentity (identifier: IdentifierLike): Promise<DocumentWASM[]> {
    return await searchByIdentity(this.grpcPool, new IdentifierWASM(identifier))
  }

  /**
   * Performs a DPNS name registration sequence
   * Contested names are include additional fee of 0.2 Dash
   * Check your name is contested with .testNameContested(name) method to check if additional fee will be charged
   *
   * @param name {string} username (ex. pshenmic.dash)
   * @param identityId {IdentifierLike} identity identifier
   * @param privateKey {PrivateKeyWASM} Authentication / High private key from your identity
   */
  async registerName (name: string, identityId: IdentifierLike, privateKey: PrivateKeyWASM): Promise<void> {
    const validation = validateName(name)

    if (validation != null) {
      throw new Error(validation)
    }

    const identity = await getIdentityByIdentifier(this.grpcPool, identityId)

    await registerName(this.grpcPool, name, identity, privateKey)
  }

  /**
   * Converts DPNS name to normalized format (ex. alice.dash -> al1ce.dash)
   *
   * source: https://github.com/dashpay/platform/blob/master/packages/js-dash-sdk/src/utils/convertToHomographSafeChars.ts
   *
   *
   * @param label {string}
   *
   * @return {string}
   */
  normalizeLabel (label: string): string {
    return convertToHomographSafeChars(label)
  }

  /**
   * Validates a DPNS name that you would like to register
   *
   * @param fullName {string} full DPNS name (ex. pshenmic.dash)
   *
   * @return {string} null if valid or string with a reason
   */
  validateName (fullName: string): null | string {
    return validateName(fullName)
  }
}
