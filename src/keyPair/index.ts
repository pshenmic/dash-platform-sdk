import deriveChild from './deriveChild'
import { HDFromSeedOptions, HDFromXKeyOptions, HDKey, HDWallet, HDXKey, Versions } from 'dashhd'
import derivePath from './derivePath'
import keyToXPublicKey from './keyToXPublicKey'
import keyToWalletId from './keyToWalletId'
import keyToXPrivateKey from './keyToXPrivateKey'
import mnemonicToIdentityKey from './mnemonicToIdentityKey'
import { WalletToIdentityKeyOpts } from '../types'
import mnemonicToSeed from './mnemonicToSeed'
import mnemonicToWallet from './mnemonicToWallet'
import privateKeyToWif from './privateKeyToWif'
import publicKeyToAddress from './publicKeyToAddress'
import seedToWallet from './seedToWallet'
import walletToIdentityKey from './walletToIdentityKey'
import xKeyToHDXKey from './xkeyToHDXKey'

/**
 * Collection of functions to work with private keys and seed phrases
 *
 * @hideconstructor
 */
export class KeyPairController {
  /**
   * Allows to derive child HD Key
   *
   * @param {HDKey} parent - The HDKey parent instance
   * @param {number} index - Index of child
   * @param hardened {boolean} - hardened or no
   * @return {Promise<HDKey>} A promise that resolves child key
   */
  async deriveChild (parent: HDKey, index: number, hardened: boolean): Promise<HDKey> {
    return await deriveChild(parent, index, hardened)
  }

  /**
   * Allows to derive HD key by path
   *
   * @param {HDKey} parent - The HDKey parent instance
   * @param {string} path - Path of children
   * @return {Promise<HDKey>} A promise that resolves key by path
   */
  async derivePath (parent: HDKey, path: string): Promise<HDKey> {
    return await derivePath(parent, path)
  }

  /**
   * Convert a HDKey to a public key
   *
   * @param {HDKey} key - The HDKey to be converted into a public key
   * @return {Promise<HDKey>} - converted public key
   */
  async keyToPublicKey (hdKey: HDKey, opts?: { version: Versions | number }): Promise<Uint8Array> {
    return await keyToXPublicKey(hdKey, opts)
  }

  /**
   * Converts a HDKey to a wallet ID
   *
   * @param {HDKey} key - The HDKey to be converted into a wallet id.
   * @return {Promise<string>} Wallet id from used key
   */
  async keyToWalletId (key: HDKey): Promise<string> {
    return await keyToWalletId(key)
  }

  /**
   * Converts an HDKey instance to an extended private key (xprv)
   *
   * @param {HDKey} hdKey - The HDKey instance to convert
   * @param {{version: Versions | number}=} [opts] - Optional, containing the version
   * @returns {Promise<string>} A promise that resolves to the xPrivateKey string
   */
  async keyToXPrivateKey (hdKey: HDKey, opts?: { version: Versions | number }): Promise<string> {
    return await keyToXPrivateKey(hdKey, opts)
  }

  /**
   * Convert a HDKey to a xPublicKey
   * @param {HDKey} hdKey - The HDKey instance to convert
   * @param {{ version: Versions | number }} [opts] - Optional, containing the version
   * @return {Promise<Uint8Array>}
   */
  async keyToXPublicKey (hdKey: HDKey, opts?: { version: Versions | number }): Promise<Uint8Array> {
    return await keyToXPublicKey(hdKey, opts)
  }

  /**
   * Derives an Identity HDKey from a mnemonic phrase.
   *
   * @param {string} mnemonic - The BIP39 mnemonic phrase.
   * @param {number} [identityIndex=0] - The identity index (default: 0).
   * @param {number} [keyIndex=0] - The key index within the identity (default: 0).
   * @param {string} [salt] - Optional salt for seed derivation.
   * @param {boolean} [verify] - Whether to verify the mnemonic during derivation.
   * @param {HDFromSeedOptions & WalletToIdentityKeyOpts} [opts] - Additional options for HD seed derivation and wallet-to-identity conversion.
   * @returns {Promise<HDKey>} A promise that resolves to the derived identity HDKey.
   */
  async mnemonicToIdentityKey (mnemonic: string, identityIndex: number | undefined = 0, keyIndex: number | undefined = 0, salt?: string, verify?: boolean, opts?: HDFromSeedOptions & WalletToIdentityKeyOpts): Promise<HDKey> {
    return await mnemonicToIdentityKey(mnemonic, identityIndex, keyIndex, salt, verify, opts)
  }

  /**
   * Returns seed from mnemonic phrase
   *
   * @param {string} mnemonic - The BIP39 mnemonic phrase.
   * @param {string} [salt] -  Optional salt for seed derivation.
   * @param {boolean} [verify] - Whether to verify the mnemonic during derivation.
   * @return {Promise<Uint8Array>} Seed bytes
   */
  async mnemonicToSeed (mnemonic: string, salt?: string, verify?: boolean): Promise<Uint8Array> {
    return await mnemonicToSeed(mnemonic, salt, verify)
  }

  /**
   * Returns wallet from mnemonic phrase
   *
   * @param {string} mnemonic - The BIP39 mnemonic phrase.
   * @param {string} [salt] - Optional salt for seed derivation.
   * @param {boolean} [verify] - Whether to verify the mnemonic during derivation.
   * @param {HDFromSeedOptions} [opts]
   * @return {Promise<HDWallet>} Wallet from mnemonic
   */
  async mnemonicToWallet (mnemonic: string, salt?: string, verify?: boolean, opts?: HDFromSeedOptions): Promise<HDKey> {
    return await mnemonicToWallet(mnemonic, salt, verify, opts)
  }

  /**
   * Convert a private key to WIF
   *
   * @param {Uint8Array} privateKeyBytes - Private key bytes
   * @param {{version: Versions | number}} [opts={version: "testnet"}] - Optional options with network version
   * @return {Promise<string>} WIF
   */
  async privateKeyToWif (privateKeyBytes: Uint8Array, opts: { version: Versions | number } | undefined = { version: 'testnet' }): Promise<string> {
    return await privateKeyToWif(privateKeyBytes, opts)
  }

  /**
   * Convert public key to
   *
   * @param {Uint8Array} publicKeyBytes - Bytes of public key
   * @param {{version: Versions | number}} [opts={version: "testnet"}] - Optional options with network version
   */
  async publicKeyToAddress (publicKeyBytes: Uint8Array, opts?: { version: Versions | number }): Promise<string> {
    return await publicKeyToAddress(publicKeyBytes, opts)
  }

  /** Convert seed bytes to wallet
   *
   * @param {Uint8Array} seed - seed bytes
   * @param {HDFromSeedOptions} [opts={version: "testnet"}] - Optional options with network version
   * @return {Promise<HDWallet>}
   */
  async seedToWallet (seed: Uint8Array, opts: HDFromSeedOptions | undefined = { versions: 'testnet' }): Promise<HDWallet> {
    return await seedToWallet(seed, opts)
  }

  /** Returns identity key from wallet
   *
   * @param {HDWallet | HDKey} wallet - wallet that will be used
   * @param {number} identityIndex - index of identity for wallet
   * @param {number} keyIndex - index of key for identity
   * @param {WalletToIdentityKeyOpts} [opts]
   * @return {Promise<HDKey>}
   */
  async walletToIdentityKey (wallet: HDWallet | HDKey, identityIndex: number, keyIndex: number, opts?: WalletToIdentityKeyOpts): Promise<HDKey> {
    return await walletToIdentityKey(wallet, identityIndex, keyIndex, opts)
  }

  /**
   * Allows to convert xKey to HDXKey
   *
   * @param {string} xKey - String with xKey
   * @param {HDFromXKeyOptions} [opts]
   * @return {Promise<HDXKey>}
   */
  async xKeyToHDXKey (xKey: string, opts?: HDFromXKeyOptions): Promise<HDXKey> {
    return await xKeyToHDXKey(xKey, opts)
  }
}
