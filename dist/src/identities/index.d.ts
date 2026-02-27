import { IdentifierLike, IdentityTransitionParams } from '../../types.js';
import GRPCConnectionPool from '../grpcConnectionPool.js';
import { IdentityPublicKeyWASM, IdentityWASM, StateTransitionWASM } from 'pshenmic-dpp';
/**
 * Collection of methods to query identities and its related data
 *
 * @hideconstructor
 */
export declare class IdentitiesController {
    /** @ignore */
    grpcPool: GRPCConnectionPool;
    constructor(grpcPool: GRPCConnectionPool);
    /**
     * Get current balance of your Identity by identifier
     *
     * @param identifier {IdentifierLike} Identifier of an identity
     *
     * @return {Promise<bigint>}
     */
    getIdentityBalance(identifier: IdentifierLike): Promise<bigint>;
    /**
     * Retrieves an Identity from the network by give public key hash
     *
     * @param hex {string} public key hash value in hex, should be a length of 40
     *
     * @return {Promise<IdentityWASM>}
     */
    getIdentityByPublicKeyHash(hex: string): Promise<IdentityWASM>;
    /**
     * Retrieves an Identity from the network by non-unique public key hash (like Voter Identity, SHA160)
     *
     * @param hex {string} public key hash value in hex, should be a length of 40
     *
     * @return {Promise<IdentityWASM>}
     */
    getIdentityByNonUniquePublicKeyHash(hex: string): Promise<IdentityWASM>;
    /**
     * Retrieves Identity by identifier from the network
     * @param identifier {IdentifierLike} identifier
     *
     * @return {Promise<IdentityWASM>}
     */
    getIdentityByIdentifier(identifier: IdentifierLike): Promise<IdentityWASM>;
    /**
     * Get Identity Nonce (usually used by Identity transitions)
     * @param identifier
     */
    getIdentityNonce(identifier: IdentifierLike): Promise<bigint>;
    /**
     * Get Identity Contract Nonce (usually used by Document transitions)
     * @param identifier
     * @param dataContract
     *
     * @return {Promise<bigint>}
     */
    getIdentityContractNonce(identifier: IdentifierLike, dataContract: IdentifierLike): Promise<bigint>;
    /**
     * Retrieve given Identity's public keys
     * @param identifier {IdentifierLike}
     * @param keyIds {=number[]} optional, specific keyIds to request
     *
     * @return {Promise<IdentityPublicKeyWASM[]>}
     */
    getIdentityPublicKeys(identifier: IdentifierLike, keyIds?: number[]): Promise<IdentityPublicKeyWASM[]>;
    /**
     * Helper function for creating {StateTransitionWASM} for Identity transitions
     *
     * To create an IdentityCreateTransition, you should pass a params.assetLockProof object containing
     * all necessary AssetLockProof data to make the transaction.
     * Both InstantSend and ChainLock AssetLock proofs supported
     *
     * Please refer to Identity.spec.js or README for example commands
     *
     * @param type {string} type of transition, must be a one of ('create' | 'update' | 'topUp' | 'creditTransfer' | 'withdrawal')
     * @param params {IdentityTransitionParams} params
     */
    createStateTransition(type: 'create' | 'update' | 'topUp' | 'creditTransfer' | 'withdrawal', params: IdentityTransitionParams): StateTransitionWASM;
}
