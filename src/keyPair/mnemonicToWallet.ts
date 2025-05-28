import { HDFromSeedOptions, HDWallet } from 'dashhd'
import mnemonicToSeed from './mnemonicToSeed'
import seedToWallet from './seedToWallet'

export default async function mnemonicToWallet (mnemonic: string, salt?: string, verify?: boolean, opts?: HDFromSeedOptions): Promise<HDWallet> {
  const seed = await mnemonicToSeed(mnemonic, salt, verify)

  return await seedToWallet(seed, opts)
}
