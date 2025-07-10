import { Versions } from 'dashhd'
import * as DashHD from 'dashhd'

/**
 * Convert public key to
 *
 * @param {Uint8Array} publicKeyBytes - Bytes of public key
 * @param {{version: Versions | number}} [opts={version: "testnet"}] - Optional options with network version
 */
export default async function publicKeyToAddress (publicKeyBytes: Uint8Array, opts: {
  version: Versions | number
} | undefined = { version: 'testnet' }): Promise<string> {
  return await DashHD.toAddr(publicKeyBytes, opts)
}
