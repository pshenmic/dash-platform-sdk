import { HDFromSeedOptions, HDWallet } from 'dashhd'
import mnemonicToSeed from './mnemonicToSeed'
import seedToWalletKey from './seedToWalletKey'

export default async function mnemonicToWalletKey (mnemonic: string, salt?: string, verify?: boolean, opts?: HDFromSeedOptions): Promise<HDWallet> {
  const seed = await mnemonicToSeed(mnemonic, salt, verify)

  return await seedToWalletKey(seed, opts)
}
