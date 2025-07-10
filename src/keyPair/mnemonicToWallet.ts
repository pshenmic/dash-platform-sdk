import { HDFromSeedOptions, HDWallet } from 'dashhd'
import mnemonicToSeed from './mnemonicToSeed'
import seedToWallet from './seedToWallet'

/**
 * Returns wallet from mnemonic phrase
 *
 * @param {string} mnemonic - The BIP39 mnemonic phrase.
 * @param {string} [salt] - Optional salt for seed derivation.
 * @param {boolean} [verify] - Whether to verify the mnemonic during derivation.
 * @param {HDFromSeedOptions} [opts]
 * @return {Promise<HDWallet>} Wallet from mnemonic
 */
export default async function mnemonicToWallet (mnemonic: string, salt?: string, verify?: boolean, opts?: HDFromSeedOptions): Promise<HDWallet> {
  const seed = await mnemonicToSeed(mnemonic, salt, verify)

  return await seedToWallet(seed, opts)
}
