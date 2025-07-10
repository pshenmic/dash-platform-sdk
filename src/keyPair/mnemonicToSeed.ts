import * as DashPhrase from 'dashphrase'

/**
 * Returns seed from mnemonic phrase
 *
 * @param {string} mnemonic - The BIP39 mnemonic phrase.
 * @param {string} [salt] -  Optional salt for seed derivation.
 * @param {boolean} [verify] - Whether to verify the mnemonic during derivation.
 * @return {Promise<Uint8Array>} Seed bytes
 */
export default async function mnemonicToSeed (mnemonic: string, salt?: string, verify?: boolean): Promise<Uint8Array> {
  return DashPhrase.toSeed(mnemonic, salt, { verify })
}
