import { HDKey } from 'dashhd'
import * as DashHD from 'dashhd'

/**
 * Allows to derive child HD Key
 *
 * @param {HDKey} parent - The HDKey parent instance
 * @param {number} index - Index of child
 * @param hardened {boolean} - hardened or no
 * @return {Promise<HDKey>} A promise that resolves child key
 */
export default async function deriveChild (parent: HDKey, index: number, hardened: boolean): Promise<HDKey> {
  return await DashHD.deriveChild(parent, index, hardened)
}
