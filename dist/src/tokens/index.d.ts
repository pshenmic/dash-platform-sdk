import GRPCConnectionPool from '../grpcConnectionPool.js';
import { IdentifierLike, TokenDirectPurchasePrices, TokenTotalSupply, TokenTransitionParams, TokenTransitionType } from '../../types.js';
import { IdentitiesTokenBalances } from './getIdentitiesTokenBalances.js';
import { IdentityTokenBalances } from './getIdentityTokensBalances.js';
import { TokenContractInfo } from './getTokenContractInfo.js';
import { StateTransitionWASM, TokenBaseTransitionWASM } from 'pshenmic-dpp';
/**
 * Tokens controller for requesting information about tokens and tokens holders
 *
 * @hideconstructor
 */
export declare class TokensController {
    /** @ignore **/
    grpcPool: GRPCConnectionPool;
    constructor(grpcPool: GRPCConnectionPool);
    /**
     * Retrieves a token balances for identities
     *
     * @param identifiers {IdentifierLike[]} - list of identifiers which balance we need to get
     * @param tokenIdentifier {IdentifierLike} - token identifier
     *
     * @return {Promise<IdentitiesTokenBalances>}
     */
    getIdentitiesTokenBalances(identifiers: IdentifierLike[], tokenIdentifier: IdentifierLike): Promise<IdentitiesTokenBalances[]>;
    /**
     * Retrieves a tokens balances for identity
     *
     * @param identifier {IdentifierLike} - identifier which balance we need to get
     * @param tokenIdentifiers {IdentifierLike[]} - list of tokens ids which used in request
     *
     * @return {Promise<IdentityTokenBalances>}
     */
    getIdentityTokensBalances(identifier: IdentifierLike, tokenIdentifiers: IdentifierLike[]): Promise<IdentityTokenBalances[]>;
    /**
     * Retrieves a tokens contract info by id
     *
     * @param tokenIdentifier {IdentifierLike} - token id which contract info we need
     *
     * @return {Promise<TokenContractInfo>}
     */
    getTokenContractInfo(tokenIdentifier: IdentifierLike): Promise<TokenContractInfo>;
    /**
     * Retrieves a token total supply
     *
     * @param tokenIdentifier {IdentifierLike} - token id which total supply we need
     *
     * @return {Promise<TokenTotalSupply>}
     */
    getTokenTotalSupply(tokenIdentifier: IdentifierLike): Promise<TokenTotalSupply>;
    /**
     * Retrieves a tokens prices
     *
     * @param tokenIdentifiers {IdentifierLike[]} - token ids which price we need
     *
     * @return {Promise<TokenDirectPurchasePrices[]>}
     */
    getTokensDirectPurchasePrice(tokenIdentifiers: IdentifierLike[]): Promise<TokenDirectPurchasePrices[]>;
    /**
     * Creates a Token Base Transition that contains base information about token transition
     *
     * @param tokenId {IdentifierLike} - token identifier
     * @param ownerId {IdentifierLike} - identity identifier of sender of the transaction
     *
     * @return {TokenBaseTransitionWASM}
     */
    createBaseTransition(tokenId: IdentifierLike, ownerId: IdentifierLike): Promise<TokenBaseTransitionWASM>;
    /**
     * Helper function for creation of a token state transition to be broadcasted in the network
     *
     * You have to pass token base transition acquired from .createBaseTransition() method
     * together with token transition type and its params
     *
     * @param base {TokenBaseTransitionWASM} - token Base transition
     * @param ownerId {IdentifierLike} - `identity identifier of the owner of the transaction`
     * @param type {TokenTransitionType} - token transition type as string (f.e. 'transfer')
     * @param params {TokenTransitionParams} - params required for a token transition
     *
     * @return {StateTransitionWASM}
     */
    createStateTransition(base: TokenBaseTransitionWASM, ownerId: IdentifierLike, type: TokenTransitionType, params: TokenTransitionParams): StateTransitionWASM;
}
