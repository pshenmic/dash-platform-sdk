import { Platform } from "./platform.js";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service org.dash.platform.dapi.v0.Platform
 */
export class PlatformClient {
    _transport;
    typeName = Platform.typeName;
    methods = Platform.methods;
    options = Platform.options;
    constructor(_transport) {
        this._transport = _transport;
    }
    /**
     * @generated from protobuf rpc: broadcastStateTransition
     */
    broadcastStateTransition(input, options) {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentity
     */
    getIdentity(input, options) {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentityKeys
     */
    getIdentityKeys(input, options) {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentitiesContractKeys
     */
    getIdentitiesContractKeys(input, options) {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentityNonce
     */
    getIdentityNonce(input, options) {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentityContractNonce
     */
    getIdentityContractNonce(input, options) {
        const method = this.methods[5], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentityBalance
     */
    getIdentityBalance(input, options) {
        const method = this.methods[6], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentitiesBalances
     */
    getIdentitiesBalances(input, options) {
        const method = this.methods[7], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentityBalanceAndRevision
     */
    getIdentityBalanceAndRevision(input, options) {
        const method = this.methods[8], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getDataContract
     */
    getDataContract(input, options) {
        const method = this.methods[9], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getDocuments
     */
    getDocuments(input, options) {
        const method = this.methods[10], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentityByPublicKeyHash
     */
    getIdentityByPublicKeyHash(input, options) {
        const method = this.methods[11], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentityByNonUniquePublicKeyHash
     */
    getIdentityByNonUniquePublicKeyHash(input, options) {
        const method = this.methods[12], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getEpochsInfo
     */
    getEpochsInfo(input, options) {
        const method = this.methods[13], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getContestedResources
     */
    getContestedResources(input, options) {
        const method = this.methods[14], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getContestedResourceVoteState
     */
    getContestedResourceVoteState(input, options) {
        const method = this.methods[15], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getTotalCreditsInPlatform
     */
    getTotalCreditsInPlatform(input, options) {
        const method = this.methods[16], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getStatus
     */
    getStatus(input, options) {
        const method = this.methods[17], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentityTokenBalances
     */
    getIdentityTokenBalances(input, options) {
        const method = this.methods[18], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getIdentitiesTokenBalances
     */
    getIdentitiesTokenBalances(input, options) {
        const method = this.methods[19], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getTokenContractInfo
     */
    getTokenContractInfo(input, options) {
        const method = this.methods[20], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getTokenDirectPurchasePrices
     */
    getTokenDirectPurchasePrices(input, options) {
        const method = this.methods[21], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: getTokenTotalSupply
     */
    getTokenTotalSupply(input, options) {
        const method = this.methods[22], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: waitForStateTransitionResult
     */
    waitForStateTransitionResult(input, options) {
        const method = this.methods[23], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
}
