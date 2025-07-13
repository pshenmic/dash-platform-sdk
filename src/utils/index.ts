import convertToHomographSafeChars from './convertToHomographSafeChars'
import { base58 } from '@scure/base'
import hexToBytes from './hexToBytes'
import bytesToHex from './bytesToHex'

/**
 * Collection of conversion functions
 *
 * @hideconstructor
 */
export class UtilsController {
  /**
   * Converts base58 string to an Uint8Array
   *
   * @param str {string}
   *
   * @returns {Uint8Array}
   */
  base58ToBytes (str: string): Uint8Array {
    return base58.decode(str)
  }

  /**
   * Converts Uint8Array to base58 string
   *
   * @param bytes {Uint8Array}
   *
   * @return {string}
   */
  bytesToBase58 (bytes: Uint8Array): string {
    return base58.encode(bytes)
  }

  /**
   * Converts Uint8Array to hex string
   *
   * @param bytes {Uint8Array}
   *
   * @return {string}
   */
  bytesToHex (bytes: Uint8Array): string {
    return bytesToHex(bytes)
  }

  /**
   * Converts a hex string to Uint8Array
   *
   * @param hex {string} hex-encoded string
   *
   * @return {Uint8Array}
   */
  hexToBytes (hex: string): Uint8Array {
    return hexToBytes(hex)
  }

  /**
   * Converts DPNS name to normalized format (ex. alice.dash -> al1ce.dash)
   *
   * source: https://github.com/dashpay/platform/blob/master/packages/js-dash-sdk/src/utils/convertToHomographSafeChars.ts
   *
   * @param str {string}
   *
   * @return {string}
   */
  convertToHomographSafeChars (str: string): string {
    return convertToHomographSafeChars(str)
  }
}
