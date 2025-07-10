import { HDKey, Versions } from 'dashhd'
import * as DashHD from 'dashhd'

/**
 * Convert a HDKey to a xPublicKey
 * @param {HDKey} hdKey - The HDKey instance to convert
 * @param {{ version: Versions | number }} [opts] - Optional, containing the version
 * @return {Promise<Uint8Array>}
 */
export default async function keyToXPublicKey (hdKey: HDKey, opts?: { version: Versions | number }): Promise<Uint8Array> {
  return await DashHD.toXPub(hdKey, opts)
}
