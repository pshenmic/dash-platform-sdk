import getIdentitiesTokenBalances from './getIdentitiesTokenBalances.js';
import getIdentityTokensBalances from './getIdentityTokensBalances.js';
import getTokenContractInfo from './getTokenContractInfo.js';
import getTokenTotalSupply from './getTokenTotalSupply.js';
import createStateTransition from './createStateTransition.js';
import { IdentifierWASM, TokenBaseTransitionWASM, TokenPricingScheduleWASM } from 'pshenmic-dpp';
import getIdentityContractNonce from '../identities/getIdentityContractNonce.js';
import getTokenDirectPurchasePrices from './getTokenDirectPurchasePrices.js';
/**
 * Tokens controller for requesting information about tokens and tokens holders
 *
 * @hideconstructor
 */
export class TokensController {
    /** @ignore **/
    grpcPool;
    constructor(grpcPool) {
        this.grpcPool = grpcPool;
    }
    /**
     * Retrieves a token balances for identities
     *
     * @param identifiers {IdentifierLike[]} - list of identifiers which balance we need to get
     * @param tokenIdentifier {IdentifierLike} - token identifier
     *
     * @return {Promise<IdentitiesTokenBalances>}
     */
    async getIdentitiesTokenBalances(identifiers, tokenIdentifier) {
        return await getIdentitiesTokenBalances(this.grpcPool, identifiers, tokenIdentifier);
    }
    /**
     * Retrieves a tokens balances for identity
     *
     * @param identifier {IdentifierLike} - identifier which balance we need to get
     * @param tokenIdentifiers {IdentifierLike[]} - list of tokens ids which used in request
     *
     * @return {Promise<IdentityTokenBalances>}
     */
    async getIdentityTokensBalances(identifier, tokenIdentifiers) {
        return await getIdentityTokensBalances(this.grpcPool, identifier, tokenIdentifiers);
    }
    /**
     * Retrieves a tokens contract info by id
     *
     * @param tokenIdentifier {IdentifierLike} - token id which contract info we need
     *
     * @return {Promise<TokenContractInfo>}
     */
    async getTokenContractInfo(tokenIdentifier) {
        return await getTokenContractInfo(this.grpcPool, tokenIdentifier);
    }
    /**
     * Retrieves a token total supply
     *
     * @param tokenIdentifier {IdentifierLike} - token id which total supply we need
     *
     * @return {Promise<TokenTotalSupply>}
     */
    async getTokenTotalSupply(tokenIdentifier) {
        return await getTokenTotalSupply(this.grpcPool, tokenIdentifier);
    }
    /**
     * Retrieves a tokens prices
     *
     * @param tokenIdentifiers {IdentifierLike[]} - token ids which price we need
     *
     * @return {Promise<TokenDirectPurchasePrices[]>}
     */
    async getTokensDirectPurchasePrice(tokenIdentifiers) {
        return await getTokenDirectPurchasePrices(this.grpcPool, tokenIdentifiers);
    }
    /**
     * Creates a Token Base Transition that contains base information about token transition
     *
     * @param tokenId {IdentifierLike} - token identifier
     * @param ownerId {IdentifierLike} - identity identifier of sender of the transaction
     *
     * @return {TokenBaseTransitionWASM}
     */
    async createBaseTransition(tokenId, ownerId) {
        const { dataContractId, tokenContractPosition } = await getTokenContractInfo(this.grpcPool, tokenId);
        const identityContractNonce = await getIdentityContractNonce(this.grpcPool, ownerId, dataContractId);
        return new TokenBaseTransitionWASM(identityContractNonce + BigInt(1), tokenContractPosition, dataContractId, tokenId, undefined);
    }
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
    createStateTransition(base, ownerId, type, params) {
        const owner = new IdentifierWASM(ownerId);
        if (params.identityId != null) {
            params.identityId = new IdentifierWASM(params.identityId);
        }
        if (params.price != null && typeof params.price === 'bigint') {
            params.price = TokenPricingScheduleWASM.SinglePrice(params.price);
        }
        return createStateTransition(base, owner, type, params);
    }
}
