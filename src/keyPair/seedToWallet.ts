import * as DashHd from 'dashhd'
import { HDFromSeedOptions, HDWallet } from 'dashhd'

/** Convert seed bytes to wallet
 *
 * @param {Uint8Array} seed - seed bytes
 * @param {HDFromSeedOptions} [opts={version: "testnet"}] - Optional options with network version
 * @return {Promise<HDWallet>}
 */
export default async function seedToWallet (seed: Uint8Array, opts: HDFromSeedOptions | undefined = { versions: 'testnet' }): Promise<HDWallet> {
  return await DashHd.fromSeed(seed, opts)
}
