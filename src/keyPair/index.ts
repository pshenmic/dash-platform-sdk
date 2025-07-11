import deriveChild from './deriveChild'
import { HDFromSeedOptions, HDFromXKeyOptions, HDKey, HDWallet, HDXKey, Versions } from 'dashhd'
import derivePath from './derivePath'
import keyToXPublicKey from './keyToXPublicKey'
import keyToWalletId from './keyToWalletId'
import keyToXPrivateKey from './keyToXPrivateKey'
import mnemonicToIdentityKey from './mnemonicToIdentityKey'
import {NetworkVersion, WalletToIdentityKeyOpts} from '../types'
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
   * @param parent {HDKey} - The HDKey parent instance
   * @param index {number} - Index of child
   * @param hardened {boolean} - hardened or no
   *
   * @return {Promise<HDKey>} A promise that resolves child key
   */
  async deriveChild(parent: HDKey, index: number, hardened: boolean): Promise<HDKey> {
    return await deriveChild(parent, index, hardened)
  }

  /**
   * Allows to derive HD key by path
   *
   * @param parent {HDKey} - The HDKey parent instance
   * @param path {string} - Path of children
   *
   * @return {Promise<HDKey>} A promise that resolves key by path
   */
  async derivePath(parent: HDKey, path: string): Promise<HDKey> {
    return await derivePath(parent, path)
  }

  /**
   * Convert a HDKey to a public key
   *
   * @param hdKey {HDKey} - The HDKey to be converted into a public key
   * @param opts {NetworkVersion=} - Network version
   *
   * @return {Promise<Uint8Array>} - converted public key
   */
  async keyToPublicKey(hdKey: HDKey, opts?: NetworkVersion): Promise<Uint8Array> {
    return await keyToXPublicKey(hdKey, opts)
  }

  /**
   * Converts a HDKey to a wallet ID
   *
   * @param hdKey {HDKey} - The HDKey to be converted into a wallet id.
   *
   * @return {Promise<string>} Wallet id from used key
   */
  async keyToWalletId(hdKey: HDKey): Promise<string> {
    return await keyToWalletId(hdKey)
  }

  /**
   * Converts an HDKey instance to an extended private key (xprv)
   *
   * @param hdKey {HDKey} - The HDKey instance to convert
   * @param opts {NetworkVersion=} - Optional, containing the version
   *
   * @returns {Promise<string>} A promise that resolves to the xPrivateKey string
   */
  async keyToXPrivateKey(hdKey: HDKey, opts?: NetworkVersion): Promise<string> {
    return await keyToXPrivateKey(hdKey, opts)
  }

  /**
   * Convert a HDKey to a xPublicKey
   * @param hdKey {HDKey} - The HDKey instance to convert
   * @param opts {NetworkVersion=} - Optional, containing the version
   *
   * @return {Promise<Uint8Array>}
   */
  async keyToXPublicKey(hdKey: HDKey, opts?: NetworkVersion): Promise<Uint8Array> {
    return await keyToXPublicKey(hdKey, opts)
  }

  /**
   * Derives an Identity HDKey from a mnemonic phrase.
   *
   * @param mnemonic {string} - The BIP39 mnemonic phrase.
   * @param identityIndex {number} - The identity index (default: 0).
   * @param keyIndex {number} - The key index within the identity (default: 0).
   * @param salt {string=} - Optional salt for seed derivation.
   * @param verify {boolean=} - Whether to verify the mnemonic during derivation.
   * @param opts {(HDFromSeedOptions & WalletToIdentityKeyOpts)=} - Additional options for HD seed derivation and wallet-to-identity conversion.
   *
   * @returns {Promise<HDKey>} A promise that resolves to the derived identity HDKey.
   */
  async mnemonicToIdentityKey(mnemonic: string, identityIndex?: number, keyIndex?: number, salt?: string, verify?: boolean, opts?: HDFromSeedOptions & WalletToIdentityKeyOpts): Promise<HDKey> {
    return await mnemonicToIdentityKey(mnemonic, identityIndex ?? 0, keyIndex ?? 0, salt, verify, opts)
  }

  /**
   * Returns seed from mnemonic phrase
   *
   * @param mnemonic {string} - The BIP39 mnemonic phrase.
   * @param salt {string=} -  Optional salt for seed derivation.
   * @param verify {boolean=} - Whether to verify the mnemonic during derivation.
   *
   * @return {Promise<Uint8Array>} Seed bytes
   */
  async mnemonicToSeed(mnemonic: string, salt?: string, verify?: boolean): Promise<Uint8Array> {
    return await mnemonicToSeed(mnemonic, salt, verify)
  }

  /**
   * Returns wallet from mnemonic phrase
   *
   * @param mnemonic {string} - The BIP39 mnemonic phrase.
   * @param salt {string=} - Optional salt for seed derivation.
   * @param verify {boolean=} - Whether to verify the mnemonic during derivation.
   * @param opts {HDFromSeedOptions=} - Optional derivation settings
   *
   * @return {Promise<HDWallet>} Wallet from mnemonic
   */
  async mnemonicToWallet(mnemonic: string, salt?: string, verify?: boolean, opts?: HDFromSeedOptions): Promise<HDKey> {
    return await mnemonicToWallet(mnemonic, salt, verify, opts)
  }

  /**
   * Convert a private key to WIF
   *
   * @param privateKeyBytes {Uint8Array} - Private key bytes
   * @param opts {NetworkVersion=} - Optional options with network version
   *
   * @return {Promise<string>} WIF
   */
  async privateKeyToWif(privateKeyBytes: Uint8Array, opts?: NetworkVersion): Promise<string> {
    return await privateKeyToWif(privateKeyBytes, opts)
  }

  /**
   * Convert public key to address
   *
   * @param publicKeyBytes {Uint8Array} - Bytes of public key
   * @param opts {NetworkVersion=} - Optional options with network version
   *
   * @return {Promise<string>} address string
   */
  async publicKeyToAddress(publicKeyBytes: Uint8Array, opts?: NetworkVersion): Promise<string> {
    return await publicKeyToAddress(publicKeyBytes, opts)
  }

  /**
   * Convert seed bytes to wallet
   *
   * @param seed {Uint8Array} - seed bytes
   * @param opts {HDFromSeedOptions?} - Optional options with network version
   *
   * @return {Promise<HDWallet>}
   */
  async seedToWallet(seed: Uint8Array, opts?: HDFromSeedOptions): Promise<HDWallet> {
    return await seedToWallet(seed, opts)
  }

  /**
   * Returns identity key from wallet
   *
   * @param wallet {HDWallet | HDKey} - wallet that will be used
   * @param identityIndex {number} - index of identity for wallet
   * @param keyIndex {number} - index of key for identity
   * @param opts {WalletToIdentityKeyOpts=} - optional options
   *
   * @return {Promise<HDKey>}
   */
  async walletToIdentityKey(wallet: HDWallet | HDKey, identityIndex: number, keyIndex: number, opts: WalletToIdentityKeyOpts = { network: 'testnet' }): Promise<HDKey> {
    return await walletToIdentityKey(wallet, identityIndex, keyIndex, opts)
  }

  /**
   * Allows to convert xKey to HDXKey
   *
   * @param xKey {string} - String with xKey
   * @param opts {HDFromXKeyOptions=} - Optional options
   * @return {Promise<HDXKey>}
   */
  async xKeyToHDXKey(xKey: string, opts?: HDFromXKeyOptions): Promise<HDXKey> {
    return await xKeyToHDXKey(xKey, opts)
  }
}
