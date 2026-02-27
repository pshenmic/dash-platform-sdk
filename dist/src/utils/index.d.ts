import { IdentifierWASM } from 'pshenmic-dpp';
import { IdentifierLike } from '../../types.js';
/**
 * Collection of conversion functions
 *
 * @hideconstructor
 */
export declare class UtilsController {
    /**
     * Converts base58 string to an Uint8Array
     *
     * @param str {string}
     *
     * @returns {Uint8Array}
     */
    base58ToBytes(str: string): Uint8Array;
    /**
     * Converts Uint8Array to base58 string
     *
     * @param bytes {Uint8Array}
     *
     * @return {string}
     */
    bytesToBase58(bytes: Uint8Array): string;
    /**
     * Converts Uint8Array to hex string
     *
     * @param bytes {Uint8Array}
     *
     * @return {string}
     */
    bytesToHex(bytes: Uint8Array): string;
    /**
     * Converts a hex string to Uint8Array
     *
     * @param hex {string} hex-encoded string
     *
     * @return {Uint8Array}
     */
    hexToBytes(hex: string): Uint8Array;
    /**
     * @deprecated use sdk.names.normalizeLabel()
     *
     * @param str {string}
     *
     * @return {string}
     */
    convertToHomographSafeChars(str: string): string;
    /**
     * Creates a voting identity identifier from proTxHash and voting address
     *
     * @param proTxHash {string} Pro TX Hash in hex format
     * @param publicKeyHash {string} Voting address's public key hash (20 bytes), in hex
     *
     * @return {Promise<string>}
     */
    createVoterIdentifier(proTxHash: string, publicKeyHash: string): Promise<IdentifierWASM>;
    /**
     * Creates a masternode identity identifier from proTxHash
     *
     * @param proTxHash {string} Pro TX Hash in hex format
     *
     * @return {string}
     * */
    createMasternodeIdentifier(proTxHash: string): IdentifierWASM;
    /**
     * Validates an identifier, accepts string or buffer
     *
     * @param identifier {IdentifierLike} identifier to test
     * @return {boolean}
     * */
    validateIdentifier(identifier: IdentifierLike): boolean;
}
