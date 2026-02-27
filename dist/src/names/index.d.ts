import GRPCConnectionPool from '../grpcConnectionPool.js';
import { DocumentWASM, PrivateKeyWASM } from 'pshenmic-dpp';
import { IdentifierLike } from '../../types.js';
/**
 * Functions related to DPNS names (usernames)
 *
 * @hideconstructor
 */
export declare class NamesController {
    /** @ignore **/
    grpcPool: GRPCConnectionPool;
    constructor(grpcPool: GRPCConnectionPool);
    /**
     * Searches for a registered DPNS name in the network
     *
     * Should be in a human-readable format, for example pshenmic.dash
     *
     * Returns a {DocumentWASM} document of type 'domain' from DPNS system data contract if found,
     * returns null if not found.
     *
     * https://testnet.platform-explorer.com/dataContract/GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec?tab=schema
     *
     * @param name {string}
     *
     * @return Promise<DocumentWASM | null>
     */
    searchByName(name: string): Promise<DocumentWASM[]>;
    /**
     * Tests a given username against contested names rules.
     * Contested names includes an additional fee of 0.2 Dash
     * as a voting resolution fee
     *
     * This function return boolean whether given username (f.e pshenmic.dash)
     * falls under contested names rules.
     * @param name
     */
    testNameContested(name: string): boolean;
    searchByIdentity(identifier: IdentifierLike): Promise<DocumentWASM[]>;
    /**
     * Performs a DPNS name registration sequence
     * Contested names are include additional fee of 0.2 Dash
     * Check your name is contested with .testNameContested(name) method to check if additional fee will be charged
     *
     * @param name {string} username (ex. pshenmic.dash)
     * @param identityId {IdentifierLike} identity identifier
     * @param privateKey {PrivateKeyWASM} Authentication / High private key from your identity
     */
    registerName(name: string, identityId: IdentifierLike, privateKey: PrivateKeyWASM): Promise<void>;
    /**
     * Converts DPNS name to normalized format (ex. alice.dash -> al1ce.dash)
     *
     * source: https://github.com/dashpay/platform/blob/master/packages/js-dash-sdk/src/utils/convertToHomographSafeChars.ts
     *
     *
     * @param label {string}
     *
     * @return {string}
     */
    normalizeLabel(label: string): string;
    /**
     * Validates a DPNS name that you would like to register
     *
     * @param fullName {string} full DPNS name (ex. pshenmic.dash)
     *
     * @return {string} null if valid or string with a reason
     */
    validateName(fullName: string): null | string;
}
