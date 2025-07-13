import * as DashHd from 'dashhd'
import { HDFromSeedOptions, HDWallet } from 'dashhd'

export default async function seedToWallet (seed: Uint8Array, opts?: HDFromSeedOptions): Promise<HDWallet> {
  return await DashHd.fromSeed(seed, opts)
}
