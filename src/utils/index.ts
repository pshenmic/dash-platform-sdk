import convertToHomographSafeChars from './convertToHomographSafeChars.js'
import { base58 } from '@scure/base'
import hexToBytes from './hexToBytes.js'
import bytesToHex from './bytesToHex.js'
import { createVoterIdentityId } from './createVoterIdentityId.js'
import { IdentifierWASM } from 'pshenmic-dpp'
import { createMasternodeIdentityId } from './createMasternodeIdentityId.js'
import {IdentifierLike} from "../types.js";

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
   * @deprecated use sdk.names.normalizeLabel()
   *
   * @param str {string}
   *
   * @return {string}
   */
  convertToHomographSafeChars (str: string): string {
    return convertToHomographSafeChars(str)
  }

  /**
   * Creates a voting identity identifier from proTxHash and voting address
   *
   * @param proTxHash {string} Pro TX Hash in hex format
   * @param publicKeyHash {string} Voting address's public key hash (20 bytes), in hex
   *
   * @return {Promise<string>}
   */
  async createVoterIdentifier (proTxHash: string, publicKeyHash: string): Promise<IdentifierWASM> {
    return await createVoterIdentityId(proTxHash, publicKeyHash)
  }

  /**
   * Creates a masternode identity identifier from proTxHash
   *
   * @param proTxHash {string} Pro TX Hash in hex format
   *
   * @return {string}
   * */
  createMasternodeIdentifier (proTxHash: string): IdentifierWASM {
    return createMasternodeIdentityId(proTxHash)
  }

  /**
   * Validates an identifier, accepts string or buffer
   *
   * @param identifier {IdentifierLike} identifier to test
   * @return {boolean}
   * */
  validateIdentifier (identifier: IdentifierLike): boolean {
    try {
      new IdentifierWASM(identifier)
      return true
    } catch (e) {
      return false
    }
  }
}
