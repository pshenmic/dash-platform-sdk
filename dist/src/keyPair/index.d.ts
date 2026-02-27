import { HDKey } from '@scure/bip32';
import { Network } from '../../types.js';
/**
 * Collection of functions to work with private keys and seed phrases
 *
 * @hideconstructor
 */
export declare class KeyPairController {
    /**
     * Returns seed from mnemonic phrase
     *
     * @param mnemonic {string} - The BIP39 mnemonic phrase.
     * @param salt {string=} -  Optional salt for seed derivation.
     *
     * @return {Uint8Array} Seed bytes
     */
    mnemonicToSeed(mnemonic: string, salt?: string): Uint8Array;
    /**
     * Returns seed from mnemonic phrase
     *
     * @param seed {Uint8Array}
     * @param network {Network} network
     *
     * @return {HDKey} HDKey
     */
    seedToHdKey(seed: Uint8Array, network?: Network): HDKey;
    /**
       * Allows to derive child HD Key
       *
       * @param hdKey {HDKey} - The HDKey parent instance
       * @param index {number} - Index of child
       *
       * @return {Promise<HDKey>} A promise that resolves child key
       */
    deriveChild(hdKey: HDKey, index: number): Promise<HDKey>;
    /**
       * Allows to derive HD key by path
       *
       * @param hdKey {HDKey} - The HDKey parent instance
       * @param path {string} - Path of children
       *
       * @return {Promise<HDKey>} A promise that resolves key by path
       */
    derivePath(hdKey: HDKey, path: string): Promise<HDKey>;
    /**
     * Derives an {HDKey} child by identity index and key index from an {HDKey}
     *
     * Usually used to get a identity private key from seed
     *
     * @param hdKey {HDKey}
     * @param identityIndex {number}
     * @param keyIndex {number}
     * @param network {Network}
     *
     * @returns {HDKey}
     */
    deriveIdentityPrivateKey(hdKey: HDKey, identityIndex: number, keyIndex: number, network: Network): HDKey;
    /**
     * Converts {PublicKey} to a Dash network address (P2PKH)
     *
     * @param publicKey {Uint8Array}
     * @param network {Network}
     *
     * @returns {string}
     */
    p2pkhAddress(publicKey: Uint8Array, network: Network): string;
}
