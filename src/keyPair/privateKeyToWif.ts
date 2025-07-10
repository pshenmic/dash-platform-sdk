import { Versions } from 'dashhd'
import * as DashHD from 'dashhd'

/**
 * Convert a private key to WIF
 *
 * @param {Uint8Array} privateKeyBytes - Private key bytes
 * @param {{version: Versions | number}} [opts={version: "testnet"}] - Optional options with network version
 * @return {Promise<string>} WIF
 */
export default async function privateKeyToWif (privateKeyBytes: Uint8Array, opts: {
  version: Versions | number
} | undefined = { version: 'testnet' }): Promise<string> {
  return await DashHD.toWif(privateKeyBytes, opts)
}
