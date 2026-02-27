import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import type { WaitForStateTransitionResultResponse } from "./platform.js";
import type { WaitForStateTransitionResultRequest } from "./platform.js";
import type { GetTokenTotalSupplyResponse } from "./platform.js";
import type { GetTokenTotalSupplyRequest } from "./platform.js";
import type { GetTokenDirectPurchasePricesResponse } from "./platform.js";
import type { GetTokenDirectPurchasePricesRequest } from "./platform.js";
import type { GetTokenContractInfoResponse } from "./platform.js";
import type { GetTokenContractInfoRequest } from "./platform.js";
import type { GetIdentitiesTokenBalancesResponse } from "./platform.js";
import type { GetIdentitiesTokenBalancesRequest } from "./platform.js";
import type { GetIdentityTokenBalancesResponse } from "./platform.js";
import type { GetIdentityTokenBalancesRequest } from "./platform.js";
import type { GetStatusResponse } from "./platform.js";
import type { GetStatusRequest } from "./platform.js";
import type { GetTotalCreditsInPlatformResponse } from "./platform.js";
import type { GetTotalCreditsInPlatformRequest } from "./platform.js";
import type { GetContestedResourceVoteStateResponse } from "./platform.js";
import type { GetContestedResourceVoteStateRequest } from "./platform.js";
import type { GetContestedResourcesResponse } from "./platform.js";
import type { GetContestedResourcesRequest } from "./platform.js";
import type { GetEpochsInfoResponse } from "./platform.js";
import type { GetEpochsInfoRequest } from "./platform.js";
import type { GetIdentityByNonUniquePublicKeyHashResponse } from "./platform.js";
import type { GetIdentityByNonUniquePublicKeyHashRequest } from "./platform.js";
import type { GetIdentityByPublicKeyHashResponse } from "./platform.js";
import type { GetIdentityByPublicKeyHashRequest } from "./platform.js";
import type { GetDocumentsResponse } from "./platform.js";
import type { GetDocumentsRequest } from "./platform.js";
import type { GetDataContractResponse } from "./platform.js";
import type { GetDataContractRequest } from "./platform.js";
import type { GetIdentityBalanceAndRevisionResponse } from "./platform.js";
import type { GetIdentityBalanceAndRevisionRequest } from "./platform.js";
import type { GetIdentitiesBalancesResponse } from "./platform.js";
import type { GetIdentitiesBalancesRequest } from "./platform.js";
import type { GetIdentityBalanceResponse } from "./platform.js";
import type { GetIdentityBalanceRequest } from "./platform.js";
import type { GetIdentityContractNonceResponse } from "./platform.js";
import type { GetIdentityContractNonceRequest } from "./platform.js";
import type { GetIdentityNonceResponse } from "./platform.js";
import type { GetIdentityNonceRequest } from "./platform.js";
import type { GetIdentitiesContractKeysResponse } from "./platform.js";
import type { GetIdentitiesContractKeysRequest } from "./platform.js";
import type { GetIdentityKeysResponse } from "./platform.js";
import type { GetIdentityKeysRequest } from "./platform.js";
import type { GetIdentityResponse } from "./platform.js";
import type { GetIdentityRequest } from "./platform.js";
import type { BroadcastStateTransitionResponse } from "./platform.js";
import type { BroadcastStateTransitionRequest } from "./platform.js";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service org.dash.platform.dapi.v0.Platform
 */
export interface IPlatformClient {
    /**
     * @generated from protobuf rpc: broadcastStateTransition
     */
    broadcastStateTransition(input: BroadcastStateTransitionRequest, options?: RpcOptions): UnaryCall<BroadcastStateTransitionRequest, BroadcastStateTransitionResponse>;
    /**
     * @generated from protobuf rpc: getIdentity
     */
    getIdentity(input: GetIdentityRequest, options?: RpcOptions): UnaryCall<GetIdentityRequest, GetIdentityResponse>;
    /**
     * @generated from protobuf rpc: getIdentityKeys
     */
    getIdentityKeys(input: GetIdentityKeysRequest, options?: RpcOptions): UnaryCall<GetIdentityKeysRequest, GetIdentityKeysResponse>;
    /**
     * @generated from protobuf rpc: getIdentitiesContractKeys
     */
    getIdentitiesContractKeys(input: GetIdentitiesContractKeysRequest, options?: RpcOptions): UnaryCall<GetIdentitiesContractKeysRequest, GetIdentitiesContractKeysResponse>;
    /**
     * @generated from protobuf rpc: getIdentityNonce
     */
    getIdentityNonce(input: GetIdentityNonceRequest, options?: RpcOptions): UnaryCall<GetIdentityNonceRequest, GetIdentityNonceResponse>;
    /**
     * @generated from protobuf rpc: getIdentityContractNonce
     */
    getIdentityContractNonce(input: GetIdentityContractNonceRequest, options?: RpcOptions): UnaryCall<GetIdentityContractNonceRequest, GetIdentityContractNonceResponse>;
    /**
     * @generated from protobuf rpc: getIdentityBalance
     */
    getIdentityBalance(input: GetIdentityBalanceRequest, options?: RpcOptions): UnaryCall<GetIdentityBalanceRequest, GetIdentityBalanceResponse>;
    /**
     * @generated from protobuf rpc: getIdentitiesBalances
     */
    getIdentitiesBalances(input: GetIdentitiesBalancesRequest, options?: RpcOptions): UnaryCall<GetIdentitiesBalancesRequest, GetIdentitiesBalancesResponse>;
    /**
     * @generated from protobuf rpc: getIdentityBalanceAndRevision
     */
    getIdentityBalanceAndRevision(input: GetIdentityBalanceAndRevisionRequest, options?: RpcOptions): UnaryCall<GetIdentityBalanceAndRevisionRequest, GetIdentityBalanceAndRevisionResponse>;
    /**
     * @generated from protobuf rpc: getDataContract
     */
    getDataContract(input: GetDataContractRequest, options?: RpcOptions): UnaryCall<GetDataContractRequest, GetDataContractResponse>;
    /**
     * @generated from protobuf rpc: getDocuments
     */
    getDocuments(input: GetDocumentsRequest, options?: RpcOptions): UnaryCall<GetDocumentsRequest, GetDocumentsResponse>;
    /**
     * @generated from protobuf rpc: getIdentityByPublicKeyHash
     */
    getIdentityByPublicKeyHash(input: GetIdentityByPublicKeyHashRequest, options?: RpcOptions): UnaryCall<GetIdentityByPublicKeyHashRequest, GetIdentityByPublicKeyHashResponse>;
    /**
     * @generated from protobuf rpc: getIdentityByNonUniquePublicKeyHash
     */
    getIdentityByNonUniquePublicKeyHash(input: GetIdentityByNonUniquePublicKeyHashRequest, options?: RpcOptions): UnaryCall<GetIdentityByNonUniquePublicKeyHashRequest, GetIdentityByNonUniquePublicKeyHashResponse>;
    /**
     * @generated from protobuf rpc: getEpochsInfo
     */
    getEpochsInfo(input: GetEpochsInfoRequest, options?: RpcOptions): UnaryCall<GetEpochsInfoRequest, GetEpochsInfoResponse>;
    /**
     * @generated from protobuf rpc: getContestedResources
     */
    getContestedResources(input: GetContestedResourcesRequest, options?: RpcOptions): UnaryCall<GetContestedResourcesRequest, GetContestedResourcesResponse>;
    /**
     * @generated from protobuf rpc: getContestedResourceVoteState
     */
    getContestedResourceVoteState(input: GetContestedResourceVoteStateRequest, options?: RpcOptions): UnaryCall<GetContestedResourceVoteStateRequest, GetContestedResourceVoteStateResponse>;
    /**
     * @generated from protobuf rpc: getTotalCreditsInPlatform
     */
    getTotalCreditsInPlatform(input: GetTotalCreditsInPlatformRequest, options?: RpcOptions): UnaryCall<GetTotalCreditsInPlatformRequest, GetTotalCreditsInPlatformResponse>;
    /**
     * @generated from protobuf rpc: getStatus
     */
    getStatus(input: GetStatusRequest, options?: RpcOptions): UnaryCall<GetStatusRequest, GetStatusResponse>;
    /**
     * @generated from protobuf rpc: getIdentityTokenBalances
     */
    getIdentityTokenBalances(input: GetIdentityTokenBalancesRequest, options?: RpcOptions): UnaryCall<GetIdentityTokenBalancesRequest, GetIdentityTokenBalancesResponse>;
    /**
     * @generated from protobuf rpc: getIdentitiesTokenBalances
     */
    getIdentitiesTokenBalances(input: GetIdentitiesTokenBalancesRequest, options?: RpcOptions): UnaryCall<GetIdentitiesTokenBalancesRequest, GetIdentitiesTokenBalancesResponse>;
    /**
     * @generated from protobuf rpc: getTokenContractInfo
     */
    getTokenContractInfo(input: GetTokenContractInfoRequest, options?: RpcOptions): UnaryCall<GetTokenContractInfoRequest, GetTokenContractInfoResponse>;
    /**
     * @generated from protobuf rpc: getTokenDirectPurchasePrices
     */
    getTokenDirectPurchasePrices(input: GetTokenDirectPurchasePricesRequest, options?: RpcOptions): UnaryCall<GetTokenDirectPurchasePricesRequest, GetTokenDirectPurchasePricesResponse>;
    /**
     * @generated from protobuf rpc: getTokenTotalSupply
     */
    getTokenTotalSupply(input: GetTokenTotalSupplyRequest, options?: RpcOptions): UnaryCall<GetTokenTotalSupplyRequest, GetTokenTotalSupplyResponse>;
    /**
     * @generated from protobuf rpc: waitForStateTransitionResult
     */
    waitForStateTransitionResult(input: WaitForStateTransitionResultRequest, options?: RpcOptions): UnaryCall<WaitForStateTransitionResultRequest, WaitForStateTransitionResultResponse>;
}
/**
 * @generated from protobuf service org.dash.platform.dapi.v0.Platform
 */
export declare class PlatformClient implements IPlatformClient, ServiceInfo {
    private readonly _transport;
    typeName: string;
    methods: import("@protobuf-ts/runtime-rpc").MethodInfo<any, any>[];
    options: {
        [extensionName: string]: import("@protobuf-ts/runtime").JsonValue;
    };
    constructor(_transport: RpcTransport);
    /**
     * @generated from protobuf rpc: broadcastStateTransition
     */
    broadcastStateTransition(input: BroadcastStateTransitionRequest, options?: RpcOptions): UnaryCall<BroadcastStateTransitionRequest, BroadcastStateTransitionResponse>;
    /**
     * @generated from protobuf rpc: getIdentity
     */
    getIdentity(input: GetIdentityRequest, options?: RpcOptions): UnaryCall<GetIdentityRequest, GetIdentityResponse>;
    /**
     * @generated from protobuf rpc: getIdentityKeys
     */
    getIdentityKeys(input: GetIdentityKeysRequest, options?: RpcOptions): UnaryCall<GetIdentityKeysRequest, GetIdentityKeysResponse>;
    /**
     * @generated from protobuf rpc: getIdentitiesContractKeys
     */
    getIdentitiesContractKeys(input: GetIdentitiesContractKeysRequest, options?: RpcOptions): UnaryCall<GetIdentitiesContractKeysRequest, GetIdentitiesContractKeysResponse>;
    /**
     * @generated from protobuf rpc: getIdentityNonce
     */
    getIdentityNonce(input: GetIdentityNonceRequest, options?: RpcOptions): UnaryCall<GetIdentityNonceRequest, GetIdentityNonceResponse>;
    /**
     * @generated from protobuf rpc: getIdentityContractNonce
     */
    getIdentityContractNonce(input: GetIdentityContractNonceRequest, options?: RpcOptions): UnaryCall<GetIdentityContractNonceRequest, GetIdentityContractNonceResponse>;
    /**
     * @generated from protobuf rpc: getIdentityBalance
     */
    getIdentityBalance(input: GetIdentityBalanceRequest, options?: RpcOptions): UnaryCall<GetIdentityBalanceRequest, GetIdentityBalanceResponse>;
    /**
     * @generated from protobuf rpc: getIdentitiesBalances
     */
    getIdentitiesBalances(input: GetIdentitiesBalancesRequest, options?: RpcOptions): UnaryCall<GetIdentitiesBalancesRequest, GetIdentitiesBalancesResponse>;
    /**
     * @generated from protobuf rpc: getIdentityBalanceAndRevision
     */
    getIdentityBalanceAndRevision(input: GetIdentityBalanceAndRevisionRequest, options?: RpcOptions): UnaryCall<GetIdentityBalanceAndRevisionRequest, GetIdentityBalanceAndRevisionResponse>;
    /**
     * @generated from protobuf rpc: getDataContract
     */
    getDataContract(input: GetDataContractRequest, options?: RpcOptions): UnaryCall<GetDataContractRequest, GetDataContractResponse>;
    /**
     * @generated from protobuf rpc: getDocuments
     */
    getDocuments(input: GetDocumentsRequest, options?: RpcOptions): UnaryCall<GetDocumentsRequest, GetDocumentsResponse>;
    /**
     * @generated from protobuf rpc: getIdentityByPublicKeyHash
     */
    getIdentityByPublicKeyHash(input: GetIdentityByPublicKeyHashRequest, options?: RpcOptions): UnaryCall<GetIdentityByPublicKeyHashRequest, GetIdentityByPublicKeyHashResponse>;
    /**
     * @generated from protobuf rpc: getIdentityByNonUniquePublicKeyHash
     */
    getIdentityByNonUniquePublicKeyHash(input: GetIdentityByNonUniquePublicKeyHashRequest, options?: RpcOptions): UnaryCall<GetIdentityByNonUniquePublicKeyHashRequest, GetIdentityByNonUniquePublicKeyHashResponse>;
    /**
     * @generated from protobuf rpc: getEpochsInfo
     */
    getEpochsInfo(input: GetEpochsInfoRequest, options?: RpcOptions): UnaryCall<GetEpochsInfoRequest, GetEpochsInfoResponse>;
    /**
     * @generated from protobuf rpc: getContestedResources
     */
    getContestedResources(input: GetContestedResourcesRequest, options?: RpcOptions): UnaryCall<GetContestedResourcesRequest, GetContestedResourcesResponse>;
    /**
     * @generated from protobuf rpc: getContestedResourceVoteState
     */
    getContestedResourceVoteState(input: GetContestedResourceVoteStateRequest, options?: RpcOptions): UnaryCall<GetContestedResourceVoteStateRequest, GetContestedResourceVoteStateResponse>;
    /**
     * @generated from protobuf rpc: getTotalCreditsInPlatform
     */
    getTotalCreditsInPlatform(input: GetTotalCreditsInPlatformRequest, options?: RpcOptions): UnaryCall<GetTotalCreditsInPlatformRequest, GetTotalCreditsInPlatformResponse>;
    /**
     * @generated from protobuf rpc: getStatus
     */
    getStatus(input: GetStatusRequest, options?: RpcOptions): UnaryCall<GetStatusRequest, GetStatusResponse>;
    /**
     * @generated from protobuf rpc: getIdentityTokenBalances
     */
    getIdentityTokenBalances(input: GetIdentityTokenBalancesRequest, options?: RpcOptions): UnaryCall<GetIdentityTokenBalancesRequest, GetIdentityTokenBalancesResponse>;
    /**
     * @generated from protobuf rpc: getIdentitiesTokenBalances
     */
    getIdentitiesTokenBalances(input: GetIdentitiesTokenBalancesRequest, options?: RpcOptions): UnaryCall<GetIdentitiesTokenBalancesRequest, GetIdentitiesTokenBalancesResponse>;
    /**
     * @generated from protobuf rpc: getTokenContractInfo
     */
    getTokenContractInfo(input: GetTokenContractInfoRequest, options?: RpcOptions): UnaryCall<GetTokenContractInfoRequest, GetTokenContractInfoResponse>;
    /**
     * @generated from protobuf rpc: getTokenDirectPurchasePrices
     */
    getTokenDirectPurchasePrices(input: GetTokenDirectPurchasePricesRequest, options?: RpcOptions): UnaryCall<GetTokenDirectPurchasePricesRequest, GetTokenDirectPurchasePricesResponse>;
    /**
     * @generated from protobuf rpc: getTokenTotalSupply
     */
    getTokenTotalSupply(input: GetTokenTotalSupplyRequest, options?: RpcOptions): UnaryCall<GetTokenTotalSupplyRequest, GetTokenTotalSupplyResponse>;
    /**
     * @generated from protobuf rpc: waitForStateTransitionResult
     */
    waitForStateTransitionResult(input: WaitForStateTransitionResultRequest, options?: RpcOptions): UnaryCall<WaitForStateTransitionResultRequest, WaitForStateTransitionResultResponse>;
}
