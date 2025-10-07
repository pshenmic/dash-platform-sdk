import { HDKey } from '@scure/bip32'
import mnemonicToSeed from './mnemonicToSeed'
import deriveChild from './deriveChild'
import derivePath from './derivePath'
import { Network } from '../types'
import { p2pkh } from '@scure/btc-signer'

const DASH_VERSIONS = {
  mainnet: { pubKeyHash: 0x4c, scriptHash: 0x10, bech32: 'dc', wif: 0xcc, private: 0x0488ade4, public: 0x0488b21e },
  testnet: { pubKeyHash: 0x8c, scriptHash: 0x13, bech32: 'dc', wif: 0xef, private: 0x04358394, public: 0x043587cf }
}

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
   * @return {Uint8Array} Seed bytes
   */
  mnemonicToSeed (mnemonic: string, salt?: string): Uint8Array {
    return mnemonicToSeed(mnemonic, salt)
  }

  /**
   * Returns seed from mnemonic phrase
   *
   * @param seed {Uint8Array}
   * @param network {Network} network
   *
   * @return {HDKey} HDKey
   */
  seedToHdKey (seed: Uint8Array, network: Network = 'mainnet'): HDKey {
    return HDKey.fromMasterSeed(seed, DASH_VERSIONS[network])
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

  /**
   * Returns address
   *
   */
  p2pkhAddress (publicKey: Uint8Array, network: Network): string {
    const P2PKH = p2pkh(publicKey, DASH_VERSIONS[network])

    return P2PKH.address
  }
}
