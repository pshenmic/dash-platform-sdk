import { HDFromSeedOptions, HDKey } from 'dashhd'
import mnemonicToWallet from './mnemonicToWallet'
import walletToIdentityKey from './walletToIdentityKey'
import { WalletToIdentityKeyOpts } from '../types'

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
export default async function mnemonicToIdentityKey (mnemonic: string, identityIndex: number | undefined = 0, keyIndex: number | undefined = 0, salt?: string, verify?: boolean, opts?: HDFromSeedOptions & WalletToIdentityKeyOpts): Promise<HDKey> {
  const wallet = await mnemonicToWallet(mnemonic, salt, verify, opts)

  return await walletToIdentityKey(wallet, identityIndex, keyIndex, opts)
}
