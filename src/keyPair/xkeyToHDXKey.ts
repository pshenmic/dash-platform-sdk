import { HDFromXKeyOptions, HDXKey } from 'dashhd'
import * as DashHD from 'dashhd'

/**
 * Allows to convert xKey to HDXKey
 *
 * @param {string} xKey - String with xKey
 * @param {HDFromXKeyOptions} [opts]
 * @return {Promise<HDXKey>}
 */
export default async function xkeyToHDXKey (xKey: string, opts?: HDFromXKeyOptions): Promise<HDXKey> {
  return await DashHD.fromXKey(xKey, opts)
}
