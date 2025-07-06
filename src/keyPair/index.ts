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

export class KeyPairController {
  async deriveChild (parent: HDKey, index: number, hardened: boolean): Promise<HDKey> {
    return await deriveChild(parent, index, hardened)
  }

  async derivePath (parent: HDKey, path: string): Promise<HDKey> {
    return await derivePath(parent, path)
  }

  async keyToPublicKey (hdKey: HDKey, opts?: { version: Versions | number }): Promise<Uint8Array<ArrayBufferLike>> {
    return await keyToXPublicKey(hdKey, opts)
  }

  async keyToWalletId (key: HDKey): Promise<string> {
    return await keyToWalletId(key)
  }

  async keyToXPrivateKey (hdKey: HDKey, opts?: { version: Versions | number }): Promise<string> {
    return await keyToXPrivateKey(hdKey, opts)
  }

  async keyToXPublicKey (hdKey: HDKey, opts?: { version: Versions | number }): Promise<Uint8Array<ArrayBufferLike>> {
    return await keyToXPublicKey(hdKey, opts)
  }

  async mnemonicToIdentityKey (mnemonic: string, identityIndex: number | undefined = 0, keyIndex: number | undefined = 0, salt?: string, verify?: boolean, opts?: HDFromSeedOptions & WalletToIdentityKeyOpts): Promise<HDKey> {
    return await mnemonicToIdentityKey(mnemonic, identityIndex, keyIndex, salt, verify, opts)
  }

  async mnemonicToSeed (mnemonic: string, salt?: string, verify?: boolean): Promise<Uint8Array<ArrayBufferLike>> {
    return await mnemonicToSeed(mnemonic, salt, verify)
  }

  async mnemonicToWallet (mnemonic: string, salt?: string, verify?: boolean, opts?: HDFromSeedOptions): Promise<HDKey> {
    return await mnemonicToWallet(mnemonic, salt, verify, opts)
  }

  async privateKeyToWif (privateKeyBytes: Uint8Array, opts: { version: Versions | number } | undefined = { version: 'testnet' }): Promise<string> {
    return await privateKeyToWif(privateKeyBytes, opts)
  }

  async publicKeyToAddress (publicKeyBytes: Uint8Array, opts?: { version: Versions | number }): Promise<string> {
    return await publicKeyToAddress(publicKeyBytes, opts)
  }

  async seedToWallet (seed: Uint8Array, opts: HDFromSeedOptions | undefined = { versions: 'testnet' }): Promise<HDWallet> {
    return await seedToWallet(seed, opts)
  }

  async walletToIdentityKey (wallet: HDWallet | HDKey, identityIndex: number, keyIndex: number, opts?: WalletToIdentityKeyOpts): Promise<HDKey> {
    return await walletToIdentityKey(wallet, identityIndex, keyIndex, opts)
  }

  async xKeyToHDXKey (xKey: string, opts?: HDFromXKeyOptions): Promise<HDXKey> {
    return await xKeyToHDXKey(xKey, opts)
  }
}
