import { HDKey } from 'dashhd'
import * as DashHD from 'dashhd'

/**
 * Allows to derive HD key by path
 *
 * @param {HDKey} parent - The HDKey parent instance
 * @param {string} path - Path of children
 * @return {Promise<HDKey>} A promise that resolves key by path
 */
export default async function derivePath (parent: HDKey, path: string): Promise<HDKey> {
  return await DashHD.derivePath(parent, path)
}
