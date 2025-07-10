import { HDKey, Versions } from 'dashhd'
import * as DashHD from 'dashhd'

/**
 * Converts an HDKey instance to an extended private key (xprv)
 *
 * @param {HDKey} hdKey - The HDKey instance to convert
 * @param {{version: Versions | number}=} [opts] - Optional, containing the version
 * @returns {Promise<string>} A promise that resolves to the xPrivateKey string
 */
export default async function keyToXPrivateKey (hdKey: HDKey, opts?: { version: Versions | number }): Promise<string> {
  return await DashHD.toXPrv(hdKey, opts)
}
