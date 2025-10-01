import { HDKey } from '@scure/bip32'
import mnemonicToSeed from './mnemonicToSeed'
import deriveChild from './deriveChild'
import derivePath from './derivePath'
import { Network } from '../types'

/**
 * Collection of functions to work with private keys and seed phrases
 *
 * @hideconstructor
 */
export class KeyPairController {
  /**
   * Returns seed from mnemonic phrase
   *
   * @param mnemonic {string} - The BIP39 mnemonic phrase.
   * @param salt {string=} -  Optional salt for seed derivation.
   *
   * @return {Promise<Uint8Array>} Seed bytes
   */
  async mnemonicToSeed (mnemonic: string, salt?: string): Promise<Uint8Array> {
    return await mnemonicToSeed(mnemonic, salt)
  }

  /**
   * Returns seed from mnemonic phrase
   *
   * @return {HDKey} HDKey
   * @param seed {Uint8Array}
   */
  seedToHdKey (seed: Uint8Array): HDKey {
    return HDKey.fromMasterSeed(seed)
  }

  /**
     * Allows to derive child HD Key
     *
     * @param hdKey {HDKey} - The HDKey parent instance
     * @param index {number} - Index of child
     *
     * @return {Promise<HDKey>} A promise that resolves child key
     */
  async deriveChild (hdKey: HDKey, index: number): Promise<HDKey> {
    return deriveChild(hdKey, index)
  }

  /**
     * Allows to derive HD key by path
     *
     * @param hdKey {HDKey} - The HDKey parent instance
     * @param path {string} - Path of children
     *
     * @return {Promise<HDKey>} A promise that resolves key by path
     */
  async derivePath (hdKey: HDKey, path: string): Promise<HDKey> {
    return derivePath(hdKey, path)
  }

  /**
   * Returns seed from mnemonic phrase
   *
   */
  deriveIdentityPrivateKey (hdKey: HDKey, identityIndex: number, keyIndex: number, network: Network): HDKey {
    const networkIndex = network === 'mainnet' ? 5 : 1

    const pathPostfix = `/5'/0'/0'/${identityIndex}'/${keyIndex}'`

    return derivePath(hdKey, `m/9'/${networkIndex}'${pathPostfix}`)
  }
}
