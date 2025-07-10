import { HDKey } from 'dashhd'
import * as DashHD from 'dashhd'

/**
 * Converts a HDKey to a wallet ID
 *
 * @param {HDKey} key - The HDKey to be converted into a wallet id.
 * @return {Promise<string>} Wallet id from used key
 */
export default async function keyToWalletId (key: HDKey): Promise<string> {
  return await DashHD.toId(key)
}
