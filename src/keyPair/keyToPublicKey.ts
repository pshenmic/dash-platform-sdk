import * as DashHD from 'dashhd'
import { HDKey } from 'dashhd'

/**
 * Convert a HDKey to a public key
 *
 * @param {HDKey} key - The HDKey to be converted into a public key
 * @return {Promise<HDKey>} - converted public key
 */
export default async function keyToPublicKey (key: HDKey): Promise<HDKey> {
  return DashHD.toPublic(key)
}
