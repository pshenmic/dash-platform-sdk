import { ServiceType } from "@protobuf-ts/runtime-rpc";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { UInt32Value } from "./google/protobuf/wrappers.js";
/**
 * Proof message includes cryptographic proofs for validating responses
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.Proof
 */
export interface Proof {
    /**
     * @generated from protobuf field: bytes grovedb_proof = 1
     */
    grovedbProof: Uint8Array;
    /**
     * @generated from protobuf field: bytes quorum_hash = 2
     */
    quorumHash: Uint8Array;
    /**
     * @generated from protobuf field: bytes signature = 3
     */
    signature: Uint8Array;
    /**
     * @generated from protobuf field: uint32 round = 4
     */
    round: number;
    /**
     * @generated from protobuf field: bytes block_id_hash = 5
     */
    blockIdHash: Uint8Array;
    /**
     * @generated from protobuf field: uint32 quorum_type = 6
     */
    quorumType: number;
}
/**
 * ResponseMetadata provides metadata about the blockchain state at the time of
 * response
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.ResponseMetadata
 */
export interface ResponseMetadata {
    /**
     * @generated from protobuf field: uint64 height = 1 [jstype = JS_STRING]
     */
    height: string;
    /**
     * @generated from protobuf field: uint32 core_chain_locked_height = 2
     */
    coreChainLockedHeight: number;
    /**
     * @generated from protobuf field: uint32 epoch = 3
     */
    epoch: number;
    /**
     * @generated from protobuf field: uint64 time_ms = 4 [jstype = JS_STRING]
     */
    timeMs: string;
    /**
     * @generated from protobuf field: uint32 protocol_version = 5
     */
    protocolVersion: number;
    /**
     * @generated from protobuf field: string chain_id = 6
     */
    chainId: string;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.StateTransitionBroadcastError
 */
export interface StateTransitionBroadcastError {
    /**
     * @generated from protobuf field: uint32 code = 1
     */
    code: number;
    /**
     * @generated from protobuf field: string message = 2
     */
    message: string;
    /**
     * @generated from protobuf field: bytes data = 3
     */
    data: Uint8Array;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.BroadcastStateTransitionRequest
 */
export interface BroadcastStateTransitionRequest {
    /**
     * @generated from protobuf field: bytes state_transition = 1
     */
    stateTransition: Uint8Array;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.BroadcastStateTransitionResponse
 */
export interface BroadcastStateTransitionResponse {
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityRequest
 */
export interface GetIdentityRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityRequest.GetIdentityRequestV0 v0 = 1
         */
        v0: GetIdentityRequest_GetIdentityRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityRequest.GetIdentityRequestV0
 */
export interface GetIdentityRequest_GetIdentityRequestV0 {
    /**
     * @generated from protobuf field: bytes id = 1
     */
    id: Uint8Array;
    /**
     * @generated from protobuf field: bool prove = 2
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityNonceRequest
 */
export interface GetIdentityNonceRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityNonceRequest.GetIdentityNonceRequestV0 v0 = 1
         */
        v0: GetIdentityNonceRequest_GetIdentityNonceRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityNonceRequest.GetIdentityNonceRequestV0
 */
export interface GetIdentityNonceRequest_GetIdentityNonceRequestV0 {
    /**
     * @generated from protobuf field: bytes identity_id = 1
     */
    identityId: Uint8Array;
    /**
     * @generated from protobuf field: bool prove = 2
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityContractNonceRequest
 */
export interface GetIdentityContractNonceRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityContractNonceRequest.GetIdentityContractNonceRequestV0 v0 = 1
         */
        v0: GetIdentityContractNonceRequest_GetIdentityContractNonceRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityContractNonceRequest.GetIdentityContractNonceRequestV0
 */
export interface GetIdentityContractNonceRequest_GetIdentityContractNonceRequestV0 {
    /**
     * @generated from protobuf field: bytes identity_id = 1
     */
    identityId: Uint8Array;
    /**
     * @generated from protobuf field: bytes contract_id = 2
     */
    contractId: Uint8Array;
    /**
     * @generated from protobuf field: bool prove = 3
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceRequest
 */
export interface GetIdentityBalanceRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityBalanceRequest.GetIdentityBalanceRequestV0 v0 = 1
         */
        v0: GetIdentityBalanceRequest_GetIdentityBalanceRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceRequest.GetIdentityBalanceRequestV0
 */
export interface GetIdentityBalanceRequest_GetIdentityBalanceRequestV0 {
    /**
     * @generated from protobuf field: bytes id = 1
     */
    id: Uint8Array;
    /**
     * @generated from protobuf field: bool prove = 2
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionRequest
 */
export interface GetIdentityBalanceAndRevisionRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionRequest.GetIdentityBalanceAndRevisionRequestV0 v0 = 1
         */
        v0: GetIdentityBalanceAndRevisionRequest_GetIdentityBalanceAndRevisionRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionRequest.GetIdentityBalanceAndRevisionRequestV0
 */
export interface GetIdentityBalanceAndRevisionRequest_GetIdentityBalanceAndRevisionRequestV0 {
    /**
     * @generated from protobuf field: bytes id = 1
     */
    id: Uint8Array;
    /**
     * @generated from protobuf field: bool prove = 2
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityResponse
 */
export interface GetIdentityResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityResponse.GetIdentityResponseV0 v0 = 1
         */
        v0: GetIdentityResponse_GetIdentityResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityResponse.GetIdentityResponseV0
 */
export interface GetIdentityResponse_GetIdentityResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "identity";
        /**
         * @generated from protobuf field: bytes identity = 1
         */
        identity: Uint8Array;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityNonceResponse
 */
export interface GetIdentityNonceResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityNonceResponse.GetIdentityNonceResponseV0 v0 = 1
         */
        v0: GetIdentityNonceResponse_GetIdentityNonceResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityNonceResponse.GetIdentityNonceResponseV0
 */
export interface GetIdentityNonceResponse_GetIdentityNonceResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "identityNonce";
        /**
         * @generated from protobuf field: uint64 identity_nonce = 1 [jstype = JS_STRING]
         */
        identityNonce: string;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityContractNonceResponse
 */
export interface GetIdentityContractNonceResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityContractNonceResponse.GetIdentityContractNonceResponseV0 v0 = 1
         */
        v0: GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityContractNonceResponse.GetIdentityContractNonceResponseV0
 */
export interface GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "identityContractNonce";
        /**
         * @generated from protobuf field: uint64 identity_contract_nonce = 1 [jstype = JS_STRING]
         */
        identityContractNonce: string;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceResponse
 */
export interface GetIdentityBalanceResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityBalanceResponse.GetIdentityBalanceResponseV0 v0 = 1
         */
        v0: GetIdentityBalanceResponse_GetIdentityBalanceResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceResponse.GetIdentityBalanceResponseV0
 */
export interface GetIdentityBalanceResponse_GetIdentityBalanceResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "balance";
        /**
         * @generated from protobuf field: uint64 balance = 1 [jstype = JS_STRING]
         */
        balance: string;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionResponse
 */
export interface GetIdentityBalanceAndRevisionResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionResponse.GetIdentityBalanceAndRevisionResponseV0 v0 = 1
         */
        v0: GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionResponse.GetIdentityBalanceAndRevisionResponseV0
 */
export interface GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "balanceAndRevision";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionResponse.GetIdentityBalanceAndRevisionResponseV0.BalanceAndRevision balance_and_revision = 1
         */
        balanceAndRevision: GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0_BalanceAndRevision;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionResponse.GetIdentityBalanceAndRevisionResponseV0.BalanceAndRevision
 */
export interface GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0_BalanceAndRevision {
    /**
     * @generated from protobuf field: uint64 balance = 1 [jstype = JS_STRING]
     */
    balance: string;
    /**
     * @generated from protobuf field: uint64 revision = 2 [jstype = JS_STRING]
     */
    revision: string;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.KeyRequestType
 */
export interface KeyRequestType {
    /**
     * @generated from protobuf oneof: request
     */
    request: {
        oneofKind: "allKeys";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.AllKeys all_keys = 1
         */
        allKeys: AllKeys;
    } | {
        oneofKind: "specificKeys";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.SpecificKeys specific_keys = 2
         */
        specificKeys: SpecificKeys;
    } | {
        oneofKind: "searchKey";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.SearchKey search_key = 3
         */
        searchKey: SearchKey;
    } | {
        oneofKind: undefined;
    };
}
/**
 * AllKeys is an empty message used to signify a request for all keys
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.AllKeys
 */
export interface AllKeys {
}
/**
 * SpecificKeys is used to request specific keys by their IDs
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.SpecificKeys
 */
export interface SpecificKeys {
    /**
     * @generated from protobuf field: repeated uint32 key_ids = 1
     */
    keyIds: number[];
}
/**
 * SearchKey represents a request to search for keys based on specific criteria
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.SearchKey
 */
export interface SearchKey {
    /**
     * @generated from protobuf field: map<uint32, org.dash.platform.dapi.v0.SecurityLevelMap> purpose_map = 1
     */
    purposeMap: {
        [key: number]: SecurityLevelMap;
    };
}
/**
 * SecurityLevelMap maps security levels to a request type for key retrieval
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.SecurityLevelMap
 */
export interface SecurityLevelMap {
    /**
     * @generated from protobuf field: map<uint32, org.dash.platform.dapi.v0.SecurityLevelMap.KeyKindRequestType> security_level_map = 1
     */
    securityLevelMap: {
        [key: number]: SecurityLevelMap_KeyKindRequestType;
    };
}
/**
 * @generated from protobuf enum org.dash.platform.dapi.v0.SecurityLevelMap.KeyKindRequestType
 */
export declare enum SecurityLevelMap_KeyKindRequestType {
    /**
     * Request the current key of a particular kind
     *
     * @generated from protobuf enum value: CURRENT_KEY_OF_KIND_REQUEST = 0;
     */
    CURRENT_KEY_OF_KIND_REQUEST = 0,
    /**
     * Request all keys of a particular kind
     *
     * @generated from protobuf enum value: ALL_KEYS_OF_KIND_REQUEST = 1;
     */
    ALL_KEYS_OF_KIND_REQUEST = 1
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityKeysRequest
 */
export interface GetIdentityKeysRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityKeysRequest.GetIdentityKeysRequestV0 v0 = 1
         */
        v0: GetIdentityKeysRequest_GetIdentityKeysRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityKeysRequest.GetIdentityKeysRequestV0
 */
export interface GetIdentityKeysRequest_GetIdentityKeysRequestV0 {
    /**
     * @generated from protobuf field: bytes identity_id = 1
     */
    identityId: Uint8Array;
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.KeyRequestType request_type = 2
     */
    requestType?: KeyRequestType;
    /**
     * @generated from protobuf field: google.protobuf.UInt32Value limit = 3
     */
    limit?: UInt32Value;
    /**
     * @generated from protobuf field: google.protobuf.UInt32Value offset = 4
     */
    offset?: UInt32Value;
    /**
     * @generated from protobuf field: bool prove = 5
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityKeysResponse
 */
export interface GetIdentityKeysResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityKeysResponse.GetIdentityKeysResponseV0 v0 = 1
         */
        v0: GetIdentityKeysResponse_GetIdentityKeysResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityKeysResponse.GetIdentityKeysResponseV0
 */
export interface GetIdentityKeysResponse_GetIdentityKeysResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "keys";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityKeysResponse.GetIdentityKeysResponseV0.Keys keys = 1
         */
        keys: GetIdentityKeysResponse_GetIdentityKeysResponseV0_Keys;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityKeysResponse.GetIdentityKeysResponseV0.Keys
 */
export interface GetIdentityKeysResponse_GetIdentityKeysResponseV0_Keys {
    /**
     * @generated from protobuf field: repeated bytes keys_bytes = 1
     */
    keysBytes: Uint8Array[];
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysRequest
 */
export interface GetIdentitiesContractKeysRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentitiesContractKeysRequest.GetIdentitiesContractKeysRequestV0 v0 = 1
         */
        v0: GetIdentitiesContractKeysRequest_GetIdentitiesContractKeysRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysRequest.GetIdentitiesContractKeysRequestV0
 */
export interface GetIdentitiesContractKeysRequest_GetIdentitiesContractKeysRequestV0 {
    /**
     * @generated from protobuf field: repeated bytes identities_ids = 1
     */
    identitiesIds: Uint8Array[];
    /**
     * @generated from protobuf field: bytes contract_id = 2
     */
    contractId: Uint8Array;
    /**
     * @generated from protobuf field: optional string document_type_name = 3
     */
    documentTypeName?: string;
    /**
     * @generated from protobuf field: repeated org.dash.platform.dapi.v0.KeyPurpose purposes = 4
     */
    purposes: KeyPurpose[];
    /**
     * @generated from protobuf field: bool prove = 5
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse
 */
export interface GetIdentitiesContractKeysResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0 v0 = 1
         */
        v0: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0
 */
export interface GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "identitiesKeys";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0.IdentitiesKeys identities_keys = 1
         */
        identitiesKeys: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentitiesKeys;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0.PurposeKeys
 */
export interface GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_PurposeKeys {
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.KeyPurpose purpose = 1
     */
    purpose: KeyPurpose;
    /**
     * @generated from protobuf field: repeated bytes keys_bytes = 2
     */
    keysBytes: Uint8Array[];
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0.IdentityKeys
 */
export interface GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentityKeys {
    /**
     * @generated from protobuf field: bytes identity_id = 1
     */
    identityId: Uint8Array;
    /**
     * @generated from protobuf field: repeated org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0.PurposeKeys keys = 2
     */
    keys: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_PurposeKeys[];
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0.IdentitiesKeys
 */
export interface GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentitiesKeys {
    /**
     * @generated from protobuf field: repeated org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0.IdentityKeys entries = 1
     */
    entries: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentityKeys[];
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesRequest
 */
export interface GetIdentitiesBalancesRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentitiesBalancesRequest.GetIdentitiesBalancesRequestV0 v0 = 1
         */
        v0: GetIdentitiesBalancesRequest_GetIdentitiesBalancesRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesRequest.GetIdentitiesBalancesRequestV0
 */
export interface GetIdentitiesBalancesRequest_GetIdentitiesBalancesRequestV0 {
    /**
     * @generated from protobuf field: repeated bytes ids = 1
     */
    ids: Uint8Array[];
    /**
     * @generated from protobuf field: bool prove = 2
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesResponse
 */
export interface GetIdentitiesBalancesResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentitiesBalancesResponse.GetIdentitiesBalancesResponseV0 v0 = 1
         */
        v0: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesResponse.GetIdentitiesBalancesResponseV0
 */
export interface GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "identitiesBalances";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentitiesBalancesResponse.GetIdentitiesBalancesResponseV0.IdentitiesBalances identities_balances = 1
         */
        identitiesBalances: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentitiesBalances;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesResponse.GetIdentitiesBalancesResponseV0.IdentityBalance
 */
export interface GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentityBalance {
    /**
     * @generated from protobuf field: bytes identity_id = 1
     */
    identityId: Uint8Array;
    /**
     * @generated from protobuf field: optional uint64 balance = 2 [jstype = JS_STRING]
     */
    balance?: string;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesResponse.GetIdentitiesBalancesResponseV0.IdentitiesBalances
 */
export interface GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentitiesBalances {
    /**
     * @generated from protobuf field: repeated org.dash.platform.dapi.v0.GetIdentitiesBalancesResponse.GetIdentitiesBalancesResponseV0.IdentityBalance entries = 1
     */
    entries: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentityBalance[];
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetDataContractRequest
 */
export interface GetDataContractRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetDataContractRequest.GetDataContractRequestV0 v0 = 1
         */
        v0: GetDataContractRequest_GetDataContractRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetDataContractRequest.GetDataContractRequestV0
 */
export interface GetDataContractRequest_GetDataContractRequestV0 {
    /**
     * @generated from protobuf field: bytes id = 1
     */
    id: Uint8Array;
    /**
     * @generated from protobuf field: bool prove = 2
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetDataContractResponse
 */
export interface GetDataContractResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetDataContractResponse.GetDataContractResponseV0 v0 = 1
         */
        v0: GetDataContractResponse_GetDataContractResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetDataContractResponse.GetDataContractResponseV0
 */
export interface GetDataContractResponse_GetDataContractResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "dataContract";
        /**
         * @generated from protobuf field: bytes data_contract = 1
         */
        dataContract: Uint8Array;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetDocumentsRequest
 */
export interface GetDocumentsRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetDocumentsRequest.GetDocumentsRequestV0 v0 = 1
         */
        v0: GetDocumentsRequest_GetDocumentsRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetDocumentsRequest.GetDocumentsRequestV0
 */
export interface GetDocumentsRequest_GetDocumentsRequestV0 {
    /**
     * @generated from protobuf field: bytes data_contract_id = 1
     */
    dataContractId: Uint8Array;
    /**
     * @generated from protobuf field: string document_type = 2
     */
    documentType: string;
    /**
     * @generated from protobuf field: bytes where = 3
     */
    where: Uint8Array;
    /**
     * @generated from protobuf field: bytes order_by = 4
     */
    orderBy: Uint8Array;
    /**
     * @generated from protobuf field: uint32 limit = 5
     */
    limit: number;
    /**
     * Specifies the starting point for the document retrieval
     *
     * @generated from protobuf oneof: start
     */
    start: {
        oneofKind: "startAfter";
        /**
         * @generated from protobuf field: bytes start_after = 6
         */
        startAfter: Uint8Array;
    } | {
        oneofKind: "startAt";
        /**
         * @generated from protobuf field: bytes start_at = 7
         */
        startAt: Uint8Array;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: bool prove = 8
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetDocumentsResponse
 */
export interface GetDocumentsResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetDocumentsResponse.GetDocumentsResponseV0 v0 = 1
         */
        v0: GetDocumentsResponse_GetDocumentsResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetDocumentsResponse.GetDocumentsResponseV0
 */
export interface GetDocumentsResponse_GetDocumentsResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "documents";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetDocumentsResponse.GetDocumentsResponseV0.Documents documents = 1
         */
        documents: GetDocumentsResponse_GetDocumentsResponseV0_Documents;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * Represents a collection of documents
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetDocumentsResponse.GetDocumentsResponseV0.Documents
 */
export interface GetDocumentsResponse_GetDocumentsResponseV0_Documents {
    /**
     * @generated from protobuf field: repeated bytes documents = 1
     */
    documents: Uint8Array[];
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityByPublicKeyHashRequest
 */
export interface GetIdentityByPublicKeyHashRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityByPublicKeyHashRequest.GetIdentityByPublicKeyHashRequestV0 v0 = 1
         */
        v0: GetIdentityByPublicKeyHashRequest_GetIdentityByPublicKeyHashRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityByPublicKeyHashRequest.GetIdentityByPublicKeyHashRequestV0
 */
export interface GetIdentityByPublicKeyHashRequest_GetIdentityByPublicKeyHashRequestV0 {
    /**
     * @generated from protobuf field: bytes public_key_hash = 1
     */
    publicKeyHash: Uint8Array;
    /**
     * @generated from protobuf field: bool prove = 2
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityByPublicKeyHashResponse
 */
export interface GetIdentityByPublicKeyHashResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityByPublicKeyHashResponse.GetIdentityByPublicKeyHashResponseV0 v0 = 1
         */
        v0: GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityByPublicKeyHashResponse.GetIdentityByPublicKeyHashResponseV0
 */
export interface GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "identity";
        /**
         * @generated from protobuf field: bytes identity = 1
         */
        identity: Uint8Array;
    } | {
        oneofKind: "proof";
        /**
         * requested public key hash
         *
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashRequest
 */
export interface GetIdentityByNonUniquePublicKeyHashRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashRequest.GetIdentityByNonUniquePublicKeyHashRequestV0 v0 = 1
         */
        v0: GetIdentityByNonUniquePublicKeyHashRequest_GetIdentityByNonUniquePublicKeyHashRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashRequest.GetIdentityByNonUniquePublicKeyHashRequestV0
 */
export interface GetIdentityByNonUniquePublicKeyHashRequest_GetIdentityByNonUniquePublicKeyHashRequestV0 {
    /**
     * @generated from protobuf field: bytes public_key_hash = 1
     */
    publicKeyHash: Uint8Array;
    /**
     * @generated from protobuf field: optional bytes start_after = 2
     */
    startAfter?: Uint8Array;
    /**
     * @generated from protobuf field: bool prove = 3
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashResponse
 */
export interface GetIdentityByNonUniquePublicKeyHashResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashResponse.GetIdentityByNonUniquePublicKeyHashResponseV0 v0 = 1
         */
        v0: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashResponse.GetIdentityByNonUniquePublicKeyHashResponseV0
 */
export interface GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "identity";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashResponse.GetIdentityByNonUniquePublicKeyHashResponseV0.IdentityResponse identity = 1
         */
        identity: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityResponse;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashResponse.GetIdentityByNonUniquePublicKeyHashResponseV0.IdentityProvedResponse proof = 2
         */
        proof: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityProvedResponse;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashResponse.GetIdentityByNonUniquePublicKeyHashResponseV0.IdentityResponse
 */
export interface GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityResponse {
    /**
     * @generated from protobuf field: optional bytes identity = 1
     */
    identity?: Uint8Array;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashResponse.GetIdentityByNonUniquePublicKeyHashResponseV0.IdentityProvedResponse
 */
export interface GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityProvedResponse {
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.Proof grovedb_identity_public_key_hash_proof = 1
     */
    grovedbIdentityPublicKeyHashProof?: Proof;
    /**
     * @generated from protobuf field: optional bytes identity_proof_bytes = 2
     */
    identityProofBytes?: Uint8Array;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetEpochsInfoRequest
 */
export interface GetEpochsInfoRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetEpochsInfoRequest.GetEpochsInfoRequestV0 v0 = 1
         */
        v0: GetEpochsInfoRequest_GetEpochsInfoRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetEpochsInfoRequest.GetEpochsInfoRequestV0
 */
export interface GetEpochsInfoRequest_GetEpochsInfoRequestV0 {
    /**
     * @generated from protobuf field: google.protobuf.UInt32Value start_epoch = 1
     */
    startEpoch?: UInt32Value;
    /**
     * @generated from protobuf field: uint32 count = 2
     */
    count: number;
    /**
     * @generated from protobuf field: bool ascending = 3
     */
    ascending: boolean;
    /**
     * @generated from protobuf field: bool prove = 4
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetEpochsInfoResponse
 */
export interface GetEpochsInfoResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetEpochsInfoResponse.GetEpochsInfoResponseV0 v0 = 1
         */
        v0: GetEpochsInfoResponse_GetEpochsInfoResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetEpochsInfoResponse.GetEpochsInfoResponseV0
 */
export interface GetEpochsInfoResponse_GetEpochsInfoResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "epochs";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetEpochsInfoResponse.GetEpochsInfoResponseV0.EpochInfos epochs = 1
         */
        epochs: GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfos;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * EpochInfos holds a collection of epoch information entries
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetEpochsInfoResponse.GetEpochsInfoResponseV0.EpochInfos
 */
export interface GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfos {
    /**
     * @generated from protobuf field: repeated org.dash.platform.dapi.v0.GetEpochsInfoResponse.GetEpochsInfoResponseV0.EpochInfo epoch_infos = 1
     */
    epochInfos: GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo[];
}
/**
 * EpochInfo represents information about a single epoch
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetEpochsInfoResponse.GetEpochsInfoResponseV0.EpochInfo
 */
export interface GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo {
    /**
     * @generated from protobuf field: uint32 number = 1
     */
    number: number;
    /**
     * @generated from protobuf field: uint64 first_block_height = 2 [jstype = JS_STRING]
     */
    firstBlockHeight: string;
    /**
     * @generated from protobuf field: uint32 first_core_block_height = 3
     */
    firstCoreBlockHeight: number;
    /**
     * @generated from protobuf field: uint64 start_time = 4 [jstype = JS_STRING]
     */
    startTime: string;
    /**
     * @generated from protobuf field: double fee_multiplier = 5
     */
    feeMultiplier: number;
    /**
     * @generated from protobuf field: uint32 protocol_version = 6
     */
    protocolVersion: number;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourcesRequest
 */
export interface GetContestedResourcesRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetContestedResourcesRequest.GetContestedResourcesRequestV0 v0 = 1
         */
        v0: GetContestedResourcesRequest_GetContestedResourcesRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourcesRequest.GetContestedResourcesRequestV0
 */
export interface GetContestedResourcesRequest_GetContestedResourcesRequestV0 {
    /**
     * @generated from protobuf field: bytes contract_id = 1
     */
    contractId: Uint8Array;
    /**
     * @generated from protobuf field: string document_type_name = 2
     */
    documentTypeName: string;
    /**
     * @generated from protobuf field: string index_name = 3
     */
    indexName: string;
    /**
     * @generated from protobuf field: repeated bytes start_index_values = 4
     */
    startIndexValues: Uint8Array[];
    /**
     * @generated from protobuf field: repeated bytes end_index_values = 5
     */
    endIndexValues: Uint8Array[];
    /**
     * @generated from protobuf field: optional org.dash.platform.dapi.v0.GetContestedResourcesRequest.GetContestedResourcesRequestV0.StartAtValueInfo start_at_value_info = 6
     */
    startAtValueInfo?: GetContestedResourcesRequest_GetContestedResourcesRequestV0_StartAtValueInfo;
    /**
     * @generated from protobuf field: optional uint32 count = 7
     */
    count?: number;
    /**
     * @generated from protobuf field: bool order_ascending = 8
     */
    orderAscending: boolean;
    /**
     * @generated from protobuf field: bool prove = 9
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourcesRequest.GetContestedResourcesRequestV0.StartAtValueInfo
 */
export interface GetContestedResourcesRequest_GetContestedResourcesRequestV0_StartAtValueInfo {
    /**
     * @generated from protobuf field: bytes start_value = 1
     */
    startValue: Uint8Array;
    /**
     * @generated from protobuf field: bool start_value_included = 2
     */
    startValueIncluded: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourcesResponse
 */
export interface GetContestedResourcesResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetContestedResourcesResponse.GetContestedResourcesResponseV0 v0 = 1
         */
        v0: GetContestedResourcesResponse_GetContestedResourcesResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourcesResponse.GetContestedResourcesResponseV0
 */
export interface GetContestedResourcesResponse_GetContestedResourcesResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "contestedResourceValues";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetContestedResourcesResponse.GetContestedResourcesResponseV0.ContestedResourceValues contested_resource_values = 1
         */
        contestedResourceValues: GetContestedResourcesResponse_GetContestedResourcesResponseV0_ContestedResourceValues;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourcesResponse.GetContestedResourcesResponseV0.ContestedResourceValues
 */
export interface GetContestedResourcesResponse_GetContestedResourcesResponseV0_ContestedResourceValues {
    /**
     * @generated from protobuf field: repeated bytes contested_resource_values = 1
     */
    contestedResourceValues: Uint8Array[];
}
/**
 * What's the state of a contested resource vote? (ie who is winning?)
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateRequest
 */
export interface GetContestedResourceVoteStateRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetContestedResourceVoteStateRequest.GetContestedResourceVoteStateRequestV0 v0 = 1
         */
        v0: GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateRequest.GetContestedResourceVoteStateRequestV0
 */
export interface GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0 {
    /**
     * @generated from protobuf field: bytes contract_id = 1
     */
    contractId: Uint8Array;
    /**
     * @generated from protobuf field: string document_type_name = 2
     */
    documentTypeName: string;
    /**
     * @generated from protobuf field: string index_name = 3
     */
    indexName: string;
    /**
     * @generated from protobuf field: repeated bytes index_values = 4
     */
    indexValues: Uint8Array[];
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetContestedResourceVoteStateRequest.GetContestedResourceVoteStateRequestV0.ResultType result_type = 5
     */
    resultType: GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_ResultType;
    /**
     * @generated from protobuf field: bool allow_include_locked_and_abstaining_vote_tally = 6
     */
    allowIncludeLockedAndAbstainingVoteTally: boolean;
    /**
     * @generated from protobuf field: optional org.dash.platform.dapi.v0.GetContestedResourceVoteStateRequest.GetContestedResourceVoteStateRequestV0.StartAtIdentifierInfo start_at_identifier_info = 7
     */
    startAtIdentifierInfo?: GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo;
    /**
     * @generated from protobuf field: optional uint32 count = 8
     */
    count?: number;
    /**
     * @generated from protobuf field: bool prove = 9
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateRequest.GetContestedResourceVoteStateRequestV0.StartAtIdentifierInfo
 */
export interface GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo {
    /**
     * @generated from protobuf field: bytes start_identifier = 1
     */
    startIdentifier: Uint8Array;
    /**
     * @generated from protobuf field: bool start_identifier_included = 2
     */
    startIdentifierIncluded: boolean;
}
/**
 * @generated from protobuf enum org.dash.platform.dapi.v0.GetContestedResourceVoteStateRequest.GetContestedResourceVoteStateRequestV0.ResultType
 */
export declare enum GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_ResultType {
    /**
     * @generated from protobuf enum value: DOCUMENTS = 0;
     */
    DOCUMENTS = 0,
    /**
     * @generated from protobuf enum value: VOTE_TALLY = 1;
     */
    VOTE_TALLY = 1,
    /**
     * @generated from protobuf enum value: DOCUMENTS_AND_VOTE_TALLY = 2;
     */
    DOCUMENTS_AND_VOTE_TALLY = 2
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse
 */
export interface GetContestedResourceVoteStateResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0 v0 = 1
         */
        v0: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0
 */
export interface GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "contestedResourceContenders";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0.ContestedResourceContenders contested_resource_contenders = 1
         */
        contestedResourceContenders: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0.FinishedVoteInfo
 */
export interface GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo {
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0.FinishedVoteInfo.FinishedVoteOutcome finished_vote_outcome = 1
     */
    finishedVoteOutcome: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo_FinishedVoteOutcome;
    /**
     * @generated from protobuf field: optional bytes won_by_identity_id = 2
     */
    wonByIdentityId?: Uint8Array;
    /**
     * @generated from protobuf field: uint64 finished_at_block_height = 3 [jstype = JS_STRING]
     */
    finishedAtBlockHeight: string;
    /**
     * @generated from protobuf field: uint32 finished_at_core_block_height = 4
     */
    finishedAtCoreBlockHeight: number;
    /**
     * @generated from protobuf field: uint64 finished_at_block_time_ms = 5 [jstype = JS_STRING]
     */
    finishedAtBlockTimeMs: string;
    /**
     * @generated from protobuf field: uint32 finished_at_epoch = 6
     */
    finishedAtEpoch: number;
}
/**
 * @generated from protobuf enum org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0.FinishedVoteInfo.FinishedVoteOutcome
 */
export declare enum GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo_FinishedVoteOutcome {
    /**
     * @generated from protobuf enum value: TOWARDS_IDENTITY = 0;
     */
    TOWARDS_IDENTITY = 0,
    /**
     * @generated from protobuf enum value: LOCKED = 1;
     */
    LOCKED = 1,
    /**
     * @generated from protobuf enum value: NO_PREVIOUS_WINNER = 2;
     */
    NO_PREVIOUS_WINNER = 2
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0.ContestedResourceContenders
 */
export interface GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders {
    /**
     * @generated from protobuf field: repeated org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0.Contender contenders = 1
     */
    contenders: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_Contender[];
    /**
     * @generated from protobuf field: optional uint32 abstain_vote_tally = 2
     */
    abstainVoteTally?: number;
    /**
     * @generated from protobuf field: optional uint32 lock_vote_tally = 3
     */
    lockVoteTally?: number;
    /**
     * @generated from protobuf field: optional org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0.FinishedVoteInfo finished_vote_info = 4
     */
    finishedVoteInfo?: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0.Contender
 */
export interface GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_Contender {
    /**
     * @generated from protobuf field: bytes identifier = 1
     */
    identifier: Uint8Array;
    /**
     * @generated from protobuf field: optional uint32 vote_count = 2
     */
    voteCount?: number;
    /**
     * @generated from protobuf field: optional bytes document = 3
     */
    document?: Uint8Array;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTotalCreditsInPlatformRequest
 */
export interface GetTotalCreditsInPlatformRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTotalCreditsInPlatformRequest.GetTotalCreditsInPlatformRequestV0 v0 = 1
         */
        v0: GetTotalCreditsInPlatformRequest_GetTotalCreditsInPlatformRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTotalCreditsInPlatformRequest.GetTotalCreditsInPlatformRequestV0
 */
export interface GetTotalCreditsInPlatformRequest_GetTotalCreditsInPlatformRequestV0 {
    /**
     * @generated from protobuf field: bool prove = 1
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTotalCreditsInPlatformResponse
 */
export interface GetTotalCreditsInPlatformResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTotalCreditsInPlatformResponse.GetTotalCreditsInPlatformResponseV0 v0 = 1
         */
        v0: GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTotalCreditsInPlatformResponse.GetTotalCreditsInPlatformResponseV0
 */
export interface GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "credits";
        /**
         * @generated from protobuf field: uint64 credits = 1 [jstype = JS_STRING]
         */
        credits: string;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusRequest
 */
export interface GetStatusRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusRequest.GetStatusRequestV0 v0 = 1
         */
        v0: GetStatusRequest_GetStatusRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusRequest.GetStatusRequestV0
 */
export interface GetStatusRequest_GetStatusRequestV0 {
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse
 */
export interface GetStatusResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0 v0 = 1
         */
        v0: GetStatusResponse_GetStatusResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0
 */
export interface GetStatusResponse_GetStatusResponseV0 {
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version version = 1
     */
    version?: GetStatusResponse_GetStatusResponseV0_Version;
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Node node = 2
     */
    node?: GetStatusResponse_GetStatusResponseV0_Node;
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Chain chain = 3
     */
    chain?: GetStatusResponse_GetStatusResponseV0_Chain;
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Network network = 4
     */
    network?: GetStatusResponse_GetStatusResponseV0_Network;
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.StateSync state_sync = 5
     */
    stateSync?: GetStatusResponse_GetStatusResponseV0_StateSync;
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Time time = 6
     */
    time?: GetStatusResponse_GetStatusResponseV0_Time;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version
 */
export interface GetStatusResponse_GetStatusResponseV0_Version {
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Software software = 1
     */
    software?: GetStatusResponse_GetStatusResponseV0_Version_Software;
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Protocol protocol = 2
     */
    protocol?: GetStatusResponse_GetStatusResponseV0_Version_Protocol;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Software
 */
export interface GetStatusResponse_GetStatusResponseV0_Version_Software {
    /**
     * @generated from protobuf field: string dapi = 1
     */
    dapi: string;
    /**
     * It will be missing if Drive is not responding
     *
     * @generated from protobuf field: optional string drive = 2
     */
    drive?: string;
    /**
     * It will be missing if Tenderdash is not responding
     *
     * @generated from protobuf field: optional string tenderdash = 3
     */
    tenderdash?: string;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Protocol
 */
export interface GetStatusResponse_GetStatusResponseV0_Version_Protocol {
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Protocol.Tenderdash tenderdash = 1
     */
    tenderdash?: GetStatusResponse_GetStatusResponseV0_Version_Protocol_Tenderdash;
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Protocol.Drive drive = 2
     */
    drive?: GetStatusResponse_GetStatusResponseV0_Version_Protocol_Drive;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Protocol.Tenderdash
 */
export interface GetStatusResponse_GetStatusResponseV0_Version_Protocol_Tenderdash {
    /**
     * @generated from protobuf field: uint32 p2p = 1
     */
    p2P: number;
    /**
     * @generated from protobuf field: uint32 block = 2
     */
    block: number;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Protocol.Drive
 */
export interface GetStatusResponse_GetStatusResponseV0_Version_Protocol_Drive {
    /**
     * @generated from protobuf field: uint32 latest = 3
     */
    latest: number;
    /**
     * @generated from protobuf field: uint32 current = 4
     */
    current: number;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Time
 */
export interface GetStatusResponse_GetStatusResponseV0_Time {
    /**
     * @generated from protobuf field: uint64 local = 1 [jstype = JS_STRING]
     */
    local: string;
    /**
     * It will be missing if Drive is not responding
     *
     * @generated from protobuf field: optional uint64 block = 2 [jstype = JS_STRING]
     */
    block?: string;
    /**
     * It will be missing if Drive is not responding
     *
     * @generated from protobuf field: optional uint64 genesis = 3 [jstype = JS_STRING]
     */
    genesis?: string;
    /**
     * It will be missing if Drive is not responding
     *
     * @generated from protobuf field: optional uint32 epoch = 4
     */
    epoch?: number;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Node
 */
export interface GetStatusResponse_GetStatusResponseV0_Node {
    /**
     * Platform node ID
     *
     * @generated from protobuf field: bytes id = 1
     */
    id: Uint8Array;
    /**
     * Evo masternode pro tx hash. It will be absent if the node is a fullnode
     *
     * @generated from protobuf field: optional bytes pro_tx_hash = 2
     */
    proTxHash?: Uint8Array;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Chain
 */
export interface GetStatusResponse_GetStatusResponseV0_Chain {
    /**
     * @generated from protobuf field: bool catching_up = 1
     */
    catchingUp: boolean;
    /**
     * @generated from protobuf field: bytes latest_block_hash = 2
     */
    latestBlockHash: Uint8Array;
    /**
     * @generated from protobuf field: bytes latest_app_hash = 3
     */
    latestAppHash: Uint8Array;
    /**
     * @generated from protobuf field: uint64 latest_block_height = 4 [jstype = JS_STRING]
     */
    latestBlockHeight: string;
    /**
     * @generated from protobuf field: bytes earliest_block_hash = 5
     */
    earliestBlockHash: Uint8Array;
    /**
     * @generated from protobuf field: bytes earliest_app_hash = 6
     */
    earliestAppHash: Uint8Array;
    /**
     * @generated from protobuf field: uint64 earliest_block_height = 7 [jstype = JS_STRING]
     */
    earliestBlockHeight: string;
    /**
     * @generated from protobuf field: uint64 max_peer_block_height = 9 [jstype = JS_STRING]
     */
    maxPeerBlockHeight: string;
    /**
     * Latest known core height in consensus.
     * It will be missing if Drive is not responding
     *
     * @generated from protobuf field: optional uint32 core_chain_locked_height = 10
     */
    coreChainLockedHeight?: number;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Network
 */
export interface GetStatusResponse_GetStatusResponseV0_Network {
    /**
     * @generated from protobuf field: string chain_id = 1
     */
    chainId: string;
    /**
     * @generated from protobuf field: uint32 peers_count = 2
     */
    peersCount: number;
    /**
     * @generated from protobuf field: bool listening = 3
     */
    listening: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.StateSync
 */
export interface GetStatusResponse_GetStatusResponseV0_StateSync {
    /**
     * @generated from protobuf field: uint64 total_synced_time = 1 [jstype = JS_STRING]
     */
    totalSyncedTime: string;
    /**
     * @generated from protobuf field: uint64 remaining_time = 2 [jstype = JS_STRING]
     */
    remainingTime: string;
    /**
     * @generated from protobuf field: uint32 total_snapshots = 3
     */
    totalSnapshots: number;
    /**
     * @generated from protobuf field: uint64 chunk_process_avg_time = 4 [jstype = JS_STRING]
     */
    chunkProcessAvgTime: string;
    /**
     * @generated from protobuf field: uint64 snapshot_height = 5 [jstype = JS_STRING]
     */
    snapshotHeight: string;
    /**
     * @generated from protobuf field: uint64 snapshot_chunks_count = 6 [jstype = JS_STRING]
     */
    snapshotChunksCount: string;
    /**
     * @generated from protobuf field: uint64 backfilled_blocks = 7 [jstype = JS_STRING]
     */
    backfilledBlocks: string;
    /**
     * @generated from protobuf field: uint64 backfill_blocks_total = 8 [jstype = JS_STRING]
     */
    backfillBlocksTotal: string;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesRequest
 */
export interface GetIdentityTokenBalancesRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityTokenBalancesRequest.GetIdentityTokenBalancesRequestV0 v0 = 1
         */
        v0: GetIdentityTokenBalancesRequest_GetIdentityTokenBalancesRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesRequest.GetIdentityTokenBalancesRequestV0
 */
export interface GetIdentityTokenBalancesRequest_GetIdentityTokenBalancesRequestV0 {
    /**
     * @generated from protobuf field: bytes identity_id = 1
     */
    identityId: Uint8Array;
    /**
     * @generated from protobuf field: repeated bytes token_ids = 2
     */
    tokenIds: Uint8Array[];
    /**
     * @generated from protobuf field: bool prove = 3
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesResponse
 */
export interface GetIdentityTokenBalancesResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityTokenBalancesResponse.GetIdentityTokenBalancesResponseV0 v0 = 1
         */
        v0: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesResponse.GetIdentityTokenBalancesResponseV0
 */
export interface GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "tokenBalances";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentityTokenBalancesResponse.GetIdentityTokenBalancesResponseV0.TokenBalances token_balances = 1
         */
        tokenBalances: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesResponse.GetIdentityTokenBalancesResponseV0.TokenBalanceEntry
 */
export interface GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalanceEntry {
    /**
     * @generated from protobuf field: bytes token_id = 1
     */
    tokenId: Uint8Array;
    /**
     * @generated from protobuf field: optional uint64 balance = 2
     */
    balance?: string;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesResponse.GetIdentityTokenBalancesResponseV0.TokenBalances
 */
export interface GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances {
    /**
     * @generated from protobuf field: repeated org.dash.platform.dapi.v0.GetIdentityTokenBalancesResponse.GetIdentityTokenBalancesResponseV0.TokenBalanceEntry token_balances = 1
     */
    tokenBalances: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalanceEntry[];
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesRequest
 */
export interface GetIdentitiesTokenBalancesRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesRequest.GetIdentitiesTokenBalancesRequestV0 v0 = 1
         */
        v0: GetIdentitiesTokenBalancesRequest_GetIdentitiesTokenBalancesRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesRequest.GetIdentitiesTokenBalancesRequestV0
 */
export interface GetIdentitiesTokenBalancesRequest_GetIdentitiesTokenBalancesRequestV0 {
    /**
     * @generated from protobuf field: bytes token_id = 1
     */
    tokenId: Uint8Array;
    /**
     * @generated from protobuf field: repeated bytes identity_ids = 2
     */
    identityIds: Uint8Array[];
    /**
     * @generated from protobuf field: bool prove = 3
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesResponse
 */
export interface GetIdentitiesTokenBalancesResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesResponse.GetIdentitiesTokenBalancesResponseV0 v0 = 1
         */
        v0: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesResponse.GetIdentitiesTokenBalancesResponseV0
 */
export interface GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "identityTokenBalances";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesResponse.GetIdentitiesTokenBalancesResponseV0.IdentityTokenBalances identity_token_balances = 1
         */
        identityTokenBalances: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesResponse.GetIdentitiesTokenBalancesResponseV0.IdentityTokenBalanceEntry
 */
export interface GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalanceEntry {
    /**
     * @generated from protobuf field: bytes identity_id = 1
     */
    identityId: Uint8Array;
    /**
     * @generated from protobuf field: optional uint64 balance = 2
     */
    balance?: string;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesResponse.GetIdentitiesTokenBalancesResponseV0.IdentityTokenBalances
 */
export interface GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances {
    /**
     * @generated from protobuf field: repeated org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesResponse.GetIdentitiesTokenBalancesResponseV0.IdentityTokenBalanceEntry identity_token_balances = 1
     */
    identityTokenBalances: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalanceEntry[];
}
/**
 * Request to retrieve token contract info for a specific token ID.
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenContractInfoRequest
 */
export interface GetTokenContractInfoRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTokenContractInfoRequest.GetTokenContractInfoRequestV0 v0 = 1
         */
        v0: GetTokenContractInfoRequest_GetTokenContractInfoRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenContractInfoRequest.GetTokenContractInfoRequestV0
 */
export interface GetTokenContractInfoRequest_GetTokenContractInfoRequestV0 {
    /**
     * The token ID to retrieve contract info for.
     * Must be exactly 32 bytes.
     *
     * @generated from protobuf field: bytes token_id = 1
     */
    tokenId: Uint8Array;
    /**
     * Whether to return a cryptographic proof.
     *
     * @generated from protobuf field: bool prove = 2
     */
    prove: boolean;
}
/**
 * Response to GetTokenContractInfoRequest.
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenContractInfoResponse
 */
export interface GetTokenContractInfoResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTokenContractInfoResponse.GetTokenContractInfoResponseV0 v0 = 1
         */
        v0: GetTokenContractInfoResponse_GetTokenContractInfoResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenContractInfoResponse.GetTokenContractInfoResponseV0
 */
export interface GetTokenContractInfoResponse_GetTokenContractInfoResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "data";
        /**
         * Direct token contract data
         *
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTokenContractInfoResponse.GetTokenContractInfoResponseV0.TokenContractInfoData data = 1
         */
        data: GetTokenContractInfoResponse_GetTokenContractInfoResponseV0_TokenContractInfoData;
    } | {
        oneofKind: "proof";
        /**
         * Cryptographic proof of token contract info
         *
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * Metadata about the blockchain state at the time of the query
     *
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * Direct token contract info.
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenContractInfoResponse.GetTokenContractInfoResponseV0.TokenContractInfoData
 */
export interface GetTokenContractInfoResponse_GetTokenContractInfoResponseV0_TokenContractInfoData {
    /**
     * The ID of the contract associated with the token.
     *
     * @generated from protobuf field: bytes contract_id = 1
     */
    contractId: Uint8Array;
    /**
     * The position of the token within the contract.
     *
     * @generated from protobuf field: uint32 token_contract_position = 2
     */
    tokenContractPosition: number;
}
/**
 * Retrieve direct purchase prices defined for one or more tokens.
 *
 * Some tokens can have a direct purchase price defined using
 * `TokenSetPriceForDirectPurchaseTransition` (see `dpp` crate for details).
 * This request retrieves the direct purchase prices for those tokens and
 * returns [GetTokenDirectPurchasePricesResponse].
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesRequest
 */
export interface GetTokenDirectPurchasePricesRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesRequest.GetTokenDirectPurchasePricesRequestV0 v0 = 1
         */
        v0: GetTokenDirectPurchasePricesRequest_GetTokenDirectPurchasePricesRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesRequest.GetTokenDirectPurchasePricesRequestV0
 */
export interface GetTokenDirectPurchasePricesRequest_GetTokenDirectPurchasePricesRequestV0 {
    /**
     * List of token IDs to get prices for.
     *
     * The list must not be empty.
     * Token IDs must have 32 bytes and be unique.
     * Results for non-unique token IDs are undefined.
     *
     * @generated from protobuf field: repeated bytes token_ids = 1
     */
    tokenIds: Uint8Array[];
    /**
     * Whether to return proofs for the response, or just direct response.
     *
     * @generated from protobuf field: bool prove = 2
     */
    prove: boolean;
}
/**
 * Response to GetTokenDirectPurchasePricesRequest, containing information about
 * direct purchase prices defined for requested token IDs.
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse
 */
export interface GetTokenDirectPurchasePricesResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0 v0 = 1
         */
        v0: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0
 */
export interface GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "tokenDirectPurchasePrices";
        /**
         * Contains the list of token IDs and their corresponding direct
         *
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.TokenDirectPurchasePrices token_direct_purchase_prices = 1
         */
        tokenDirectPurchasePrices: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePrices;
    } | {
        oneofKind: "proof";
        /**
         * Requested information in a form of cryptographic proof.
         * In Rust, use `FromProof` trait to convert it to the actual data.
         *
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * Metadata about the blockchain state.
     *
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * Contains the individual price tier for a specific quantity of tokens.
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.PriceForQuantity
 */
export interface GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PriceForQuantity {
    /**
     * Minimum quantity of tokens to purchase to get this price.
     *
     * @generated from protobuf field: uint64 quantity = 1
     */
    quantity: string;
    /**
     * Price for the specified quantity of tokens.
     *
     * @generated from protobuf field: uint64 price = 2
     */
    price: string;
}
/**
 * Contains list of price tiers for a specific token.
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.PricingSchedule
 */
export interface GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PricingSchedule {
    /**
     * @generated from protobuf field: repeated org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.PriceForQuantity price_for_quantity = 1
     */
    priceForQuantity: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PriceForQuantity[];
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.TokenDirectPurchasePriceEntry
 */
export interface GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePriceEntry {
    /**
     * 32-byte token identifier
     *
     * @generated from protobuf field: bytes token_id = 1
     */
    tokenId: Uint8Array;
    /**
     * Price of the token; optional
     *
     * @generated from protobuf oneof: price
     */
    price: {
        oneofKind: "fixedPrice";
        /**
         * Fixed price for the token.
         *
         * @generated from protobuf field: uint64 fixed_price = 2
         */
        fixedPrice: string;
    } | {
        oneofKind: "variablePrice";
        /**
         * Tiered pricing for the token, where the price varies based on the
         * quantity purchased.
         *
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.PricingSchedule variable_price = 3
         */
        variablePrice: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PricingSchedule;
    } | {
        oneofKind: undefined;
    };
}
/**
 * For each requested token, contains list of token IDs and their
 * corresponding direct purchase prices.
 *
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.TokenDirectPurchasePrices
 */
export interface GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePrices {
    /**
     * @generated from protobuf field: repeated org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.TokenDirectPurchasePriceEntry token_direct_purchase_price = 1
     */
    tokenDirectPurchasePrice: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePriceEntry[];
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenTotalSupplyRequest
 */
export interface GetTokenTotalSupplyRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTokenTotalSupplyRequest.GetTokenTotalSupplyRequestV0 v0 = 1
         */
        v0: GetTokenTotalSupplyRequest_GetTokenTotalSupplyRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenTotalSupplyRequest.GetTokenTotalSupplyRequestV0
 */
export interface GetTokenTotalSupplyRequest_GetTokenTotalSupplyRequestV0 {
    /**
     * @generated from protobuf field: bytes token_id = 1
     */
    tokenId: Uint8Array;
    /**
     * @generated from protobuf field: bool prove = 2
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenTotalSupplyResponse
 */
export interface GetTokenTotalSupplyResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTokenTotalSupplyResponse.GetTokenTotalSupplyResponseV0 v0 = 1
         */
        v0: GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenTotalSupplyResponse.GetTokenTotalSupplyResponseV0
 */
export interface GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "tokenTotalSupply";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.GetTokenTotalSupplyResponse.GetTokenTotalSupplyResponseV0.TokenTotalSupplyEntry token_total_supply = 1
         */
        tokenTotalSupply: GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0_TokenTotalSupplyEntry;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.GetTokenTotalSupplyResponse.GetTokenTotalSupplyResponseV0.TokenTotalSupplyEntry
 */
export interface GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0_TokenTotalSupplyEntry {
    /**
     * @generated from protobuf field: bytes token_id = 1
     */
    tokenId: Uint8Array;
    /**
     * @generated from protobuf field: uint64 total_aggregated_amount_in_user_accounts = 2
     */
    totalAggregatedAmountInUserAccounts: string;
    /**
     * @generated from protobuf field: uint64 total_system_amount = 3
     */
    totalSystemAmount: string;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.StateId
 */
export interface StateId {
    /**
     * @generated from protobuf field: fixed64 app_version = 1
     */
    appVersion: string;
    /**
     * @generated from protobuf field: fixed64 height = 2
     */
    height: string;
    /**
     * @generated from protobuf field: bytes app_hash = 3
     */
    appHash: Uint8Array;
    /**
     * @generated from protobuf field: fixed32 core_chain_locked_height = 4
     */
    coreChainLockedHeight: number;
    /**
     * @generated from protobuf field: fixed64 time = 5
     */
    time: string;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.CanonicalVote
 */
export interface CanonicalVote {
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.SignedMsgType type = 1
     */
    type: SignedMsgType;
    /**
     * @generated from protobuf field: sfixed64 height = 2
     */
    height: string;
    /**
     * @generated from protobuf field: sfixed64 round = 3
     */
    round: string;
    /**
     * @generated from protobuf field: bytes block_id = 4
     */
    blockId: Uint8Array;
    /**
     * @generated from protobuf field: bytes state_id = 5
     */
    stateId: Uint8Array;
    /**
     * @generated from protobuf field: string chain_id = 99
     */
    chainId: string;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.WaitForStateTransitionResultRequest
 */
export interface WaitForStateTransitionResultRequest {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.WaitForStateTransitionResultRequest.WaitForStateTransitionResultRequestV0 v0 = 1
         */
        v0: WaitForStateTransitionResultRequest_WaitForStateTransitionResultRequestV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.WaitForStateTransitionResultRequest.WaitForStateTransitionResultRequestV0
 */
export interface WaitForStateTransitionResultRequest_WaitForStateTransitionResultRequestV0 {
    /**
     * @generated from protobuf field: bytes state_transition_hash = 1
     */
    stateTransitionHash: Uint8Array;
    /**
     * @generated from protobuf field: bool prove = 2
     */
    prove: boolean;
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.WaitForStateTransitionResultResponse
 */
export interface WaitForStateTransitionResultResponse {
    /**
     * @generated from protobuf oneof: version
     */
    version: {
        oneofKind: "v0";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.WaitForStateTransitionResultResponse.WaitForStateTransitionResultResponseV0 v0 = 1
         */
        v0: WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message org.dash.platform.dapi.v0.WaitForStateTransitionResultResponse.WaitForStateTransitionResultResponseV0
 */
export interface WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0 {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "error";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.StateTransitionBroadcastError error = 1
         */
        error: StateTransitionBroadcastError;
    } | {
        oneofKind: "proof";
        /**
         * @generated from protobuf field: org.dash.platform.dapi.v0.Proof proof = 2
         */
        proof: Proof;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: org.dash.platform.dapi.v0.ResponseMetadata metadata = 3
     */
    metadata?: ResponseMetadata;
}
/**
 * @generated from protobuf enum org.dash.platform.dapi.v0.KeyPurpose
 */
export declare enum KeyPurpose {
    /**
     * @generated from protobuf enum value: AUTHENTICATION = 0;
     */
    AUTHENTICATION = 0,
    /**
     * @generated from protobuf enum value: ENCRYPTION = 1;
     */
    ENCRYPTION = 1,
    /**
     * @generated from protobuf enum value: DECRYPTION = 2;
     */
    DECRYPTION = 2,
    /**
     * @generated from protobuf enum value: TRANSFER = 3;
     */
    TRANSFER = 3,
    /**
     * @generated from protobuf enum value: VOTING = 5;
     */
    VOTING = 5
}
/**
 * @generated from protobuf enum org.dash.platform.dapi.v0.SignedMsgType
 */
export declare enum SignedMsgType {
    /**
     * @generated from protobuf enum value: UNKNOWN = 0;
     */
    UNKNOWN = 0,
    /**
     * @generated from protobuf enum value: PREVOTE = 1;
     */
    PREVOTE = 1,
    /**
     * @generated from protobuf enum value: PRECOMMIT = 2;
     */
    PRECOMMIT = 2,
    /**
     * @generated from protobuf enum value: PROPOSAL = 32;
     */
    PROPOSAL = 32
}
declare class Proof$Type extends MessageType<Proof> {
    constructor();
    create(value?: PartialMessage<Proof>): Proof;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Proof): Proof;
    internalBinaryWrite(message: Proof, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.Proof
 */
export declare const Proof: Proof$Type;
declare class ResponseMetadata$Type extends MessageType<ResponseMetadata> {
    constructor();
    create(value?: PartialMessage<ResponseMetadata>): ResponseMetadata;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResponseMetadata): ResponseMetadata;
    internalBinaryWrite(message: ResponseMetadata, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.ResponseMetadata
 */
export declare const ResponseMetadata: ResponseMetadata$Type;
declare class StateTransitionBroadcastError$Type extends MessageType<StateTransitionBroadcastError> {
    constructor();
    create(value?: PartialMessage<StateTransitionBroadcastError>): StateTransitionBroadcastError;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StateTransitionBroadcastError): StateTransitionBroadcastError;
    internalBinaryWrite(message: StateTransitionBroadcastError, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.StateTransitionBroadcastError
 */
export declare const StateTransitionBroadcastError: StateTransitionBroadcastError$Type;
declare class BroadcastStateTransitionRequest$Type extends MessageType<BroadcastStateTransitionRequest> {
    constructor();
    create(value?: PartialMessage<BroadcastStateTransitionRequest>): BroadcastStateTransitionRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BroadcastStateTransitionRequest): BroadcastStateTransitionRequest;
    internalBinaryWrite(message: BroadcastStateTransitionRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.BroadcastStateTransitionRequest
 */
export declare const BroadcastStateTransitionRequest: BroadcastStateTransitionRequest$Type;
declare class BroadcastStateTransitionResponse$Type extends MessageType<BroadcastStateTransitionResponse> {
    constructor();
    create(value?: PartialMessage<BroadcastStateTransitionResponse>): BroadcastStateTransitionResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BroadcastStateTransitionResponse): BroadcastStateTransitionResponse;
    internalBinaryWrite(message: BroadcastStateTransitionResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.BroadcastStateTransitionResponse
 */
export declare const BroadcastStateTransitionResponse: BroadcastStateTransitionResponse$Type;
declare class GetIdentityRequest$Type extends MessageType<GetIdentityRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentityRequest>): GetIdentityRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityRequest): GetIdentityRequest;
    internalBinaryWrite(message: GetIdentityRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityRequest
 */
export declare const GetIdentityRequest: GetIdentityRequest$Type;
declare class GetIdentityRequest_GetIdentityRequestV0$Type extends MessageType<GetIdentityRequest_GetIdentityRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityRequest_GetIdentityRequestV0>): GetIdentityRequest_GetIdentityRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityRequest_GetIdentityRequestV0): GetIdentityRequest_GetIdentityRequestV0;
    internalBinaryWrite(message: GetIdentityRequest_GetIdentityRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityRequest.GetIdentityRequestV0
 */
export declare const GetIdentityRequest_GetIdentityRequestV0: GetIdentityRequest_GetIdentityRequestV0$Type;
declare class GetIdentityNonceRequest$Type extends MessageType<GetIdentityNonceRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentityNonceRequest>): GetIdentityNonceRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityNonceRequest): GetIdentityNonceRequest;
    internalBinaryWrite(message: GetIdentityNonceRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityNonceRequest
 */
export declare const GetIdentityNonceRequest: GetIdentityNonceRequest$Type;
declare class GetIdentityNonceRequest_GetIdentityNonceRequestV0$Type extends MessageType<GetIdentityNonceRequest_GetIdentityNonceRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityNonceRequest_GetIdentityNonceRequestV0>): GetIdentityNonceRequest_GetIdentityNonceRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityNonceRequest_GetIdentityNonceRequestV0): GetIdentityNonceRequest_GetIdentityNonceRequestV0;
    internalBinaryWrite(message: GetIdentityNonceRequest_GetIdentityNonceRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityNonceRequest.GetIdentityNonceRequestV0
 */
export declare const GetIdentityNonceRequest_GetIdentityNonceRequestV0: GetIdentityNonceRequest_GetIdentityNonceRequestV0$Type;
declare class GetIdentityContractNonceRequest$Type extends MessageType<GetIdentityContractNonceRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentityContractNonceRequest>): GetIdentityContractNonceRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityContractNonceRequest): GetIdentityContractNonceRequest;
    internalBinaryWrite(message: GetIdentityContractNonceRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityContractNonceRequest
 */
export declare const GetIdentityContractNonceRequest: GetIdentityContractNonceRequest$Type;
declare class GetIdentityContractNonceRequest_GetIdentityContractNonceRequestV0$Type extends MessageType<GetIdentityContractNonceRequest_GetIdentityContractNonceRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityContractNonceRequest_GetIdentityContractNonceRequestV0>): GetIdentityContractNonceRequest_GetIdentityContractNonceRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityContractNonceRequest_GetIdentityContractNonceRequestV0): GetIdentityContractNonceRequest_GetIdentityContractNonceRequestV0;
    internalBinaryWrite(message: GetIdentityContractNonceRequest_GetIdentityContractNonceRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityContractNonceRequest.GetIdentityContractNonceRequestV0
 */
export declare const GetIdentityContractNonceRequest_GetIdentityContractNonceRequestV0: GetIdentityContractNonceRequest_GetIdentityContractNonceRequestV0$Type;
declare class GetIdentityBalanceRequest$Type extends MessageType<GetIdentityBalanceRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentityBalanceRequest>): GetIdentityBalanceRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityBalanceRequest): GetIdentityBalanceRequest;
    internalBinaryWrite(message: GetIdentityBalanceRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceRequest
 */
export declare const GetIdentityBalanceRequest: GetIdentityBalanceRequest$Type;
declare class GetIdentityBalanceRequest_GetIdentityBalanceRequestV0$Type extends MessageType<GetIdentityBalanceRequest_GetIdentityBalanceRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityBalanceRequest_GetIdentityBalanceRequestV0>): GetIdentityBalanceRequest_GetIdentityBalanceRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityBalanceRequest_GetIdentityBalanceRequestV0): GetIdentityBalanceRequest_GetIdentityBalanceRequestV0;
    internalBinaryWrite(message: GetIdentityBalanceRequest_GetIdentityBalanceRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceRequest.GetIdentityBalanceRequestV0
 */
export declare const GetIdentityBalanceRequest_GetIdentityBalanceRequestV0: GetIdentityBalanceRequest_GetIdentityBalanceRequestV0$Type;
declare class GetIdentityBalanceAndRevisionRequest$Type extends MessageType<GetIdentityBalanceAndRevisionRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentityBalanceAndRevisionRequest>): GetIdentityBalanceAndRevisionRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityBalanceAndRevisionRequest): GetIdentityBalanceAndRevisionRequest;
    internalBinaryWrite(message: GetIdentityBalanceAndRevisionRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionRequest
 */
export declare const GetIdentityBalanceAndRevisionRequest: GetIdentityBalanceAndRevisionRequest$Type;
declare class GetIdentityBalanceAndRevisionRequest_GetIdentityBalanceAndRevisionRequestV0$Type extends MessageType<GetIdentityBalanceAndRevisionRequest_GetIdentityBalanceAndRevisionRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityBalanceAndRevisionRequest_GetIdentityBalanceAndRevisionRequestV0>): GetIdentityBalanceAndRevisionRequest_GetIdentityBalanceAndRevisionRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityBalanceAndRevisionRequest_GetIdentityBalanceAndRevisionRequestV0): GetIdentityBalanceAndRevisionRequest_GetIdentityBalanceAndRevisionRequestV0;
    internalBinaryWrite(message: GetIdentityBalanceAndRevisionRequest_GetIdentityBalanceAndRevisionRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionRequest.GetIdentityBalanceAndRevisionRequestV0
 */
export declare const GetIdentityBalanceAndRevisionRequest_GetIdentityBalanceAndRevisionRequestV0: GetIdentityBalanceAndRevisionRequest_GetIdentityBalanceAndRevisionRequestV0$Type;
declare class GetIdentityResponse$Type extends MessageType<GetIdentityResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentityResponse>): GetIdentityResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityResponse): GetIdentityResponse;
    internalBinaryWrite(message: GetIdentityResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityResponse
 */
export declare const GetIdentityResponse: GetIdentityResponse$Type;
declare class GetIdentityResponse_GetIdentityResponseV0$Type extends MessageType<GetIdentityResponse_GetIdentityResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityResponse_GetIdentityResponseV0>): GetIdentityResponse_GetIdentityResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityResponse_GetIdentityResponseV0): GetIdentityResponse_GetIdentityResponseV0;
    internalBinaryWrite(message: GetIdentityResponse_GetIdentityResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityResponse.GetIdentityResponseV0
 */
export declare const GetIdentityResponse_GetIdentityResponseV0: GetIdentityResponse_GetIdentityResponseV0$Type;
declare class GetIdentityNonceResponse$Type extends MessageType<GetIdentityNonceResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentityNonceResponse>): GetIdentityNonceResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityNonceResponse): GetIdentityNonceResponse;
    internalBinaryWrite(message: GetIdentityNonceResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityNonceResponse
 */
export declare const GetIdentityNonceResponse: GetIdentityNonceResponse$Type;
declare class GetIdentityNonceResponse_GetIdentityNonceResponseV0$Type extends MessageType<GetIdentityNonceResponse_GetIdentityNonceResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityNonceResponse_GetIdentityNonceResponseV0>): GetIdentityNonceResponse_GetIdentityNonceResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityNonceResponse_GetIdentityNonceResponseV0): GetIdentityNonceResponse_GetIdentityNonceResponseV0;
    internalBinaryWrite(message: GetIdentityNonceResponse_GetIdentityNonceResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityNonceResponse.GetIdentityNonceResponseV0
 */
export declare const GetIdentityNonceResponse_GetIdentityNonceResponseV0: GetIdentityNonceResponse_GetIdentityNonceResponseV0$Type;
declare class GetIdentityContractNonceResponse$Type extends MessageType<GetIdentityContractNonceResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentityContractNonceResponse>): GetIdentityContractNonceResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityContractNonceResponse): GetIdentityContractNonceResponse;
    internalBinaryWrite(message: GetIdentityContractNonceResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityContractNonceResponse
 */
export declare const GetIdentityContractNonceResponse: GetIdentityContractNonceResponse$Type;
declare class GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0$Type extends MessageType<GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0>): GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0): GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0;
    internalBinaryWrite(message: GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityContractNonceResponse.GetIdentityContractNonceResponseV0
 */
export declare const GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0: GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0$Type;
declare class GetIdentityBalanceResponse$Type extends MessageType<GetIdentityBalanceResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentityBalanceResponse>): GetIdentityBalanceResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityBalanceResponse): GetIdentityBalanceResponse;
    internalBinaryWrite(message: GetIdentityBalanceResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceResponse
 */
export declare const GetIdentityBalanceResponse: GetIdentityBalanceResponse$Type;
declare class GetIdentityBalanceResponse_GetIdentityBalanceResponseV0$Type extends MessageType<GetIdentityBalanceResponse_GetIdentityBalanceResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityBalanceResponse_GetIdentityBalanceResponseV0>): GetIdentityBalanceResponse_GetIdentityBalanceResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityBalanceResponse_GetIdentityBalanceResponseV0): GetIdentityBalanceResponse_GetIdentityBalanceResponseV0;
    internalBinaryWrite(message: GetIdentityBalanceResponse_GetIdentityBalanceResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceResponse.GetIdentityBalanceResponseV0
 */
export declare const GetIdentityBalanceResponse_GetIdentityBalanceResponseV0: GetIdentityBalanceResponse_GetIdentityBalanceResponseV0$Type;
declare class GetIdentityBalanceAndRevisionResponse$Type extends MessageType<GetIdentityBalanceAndRevisionResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentityBalanceAndRevisionResponse>): GetIdentityBalanceAndRevisionResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityBalanceAndRevisionResponse): GetIdentityBalanceAndRevisionResponse;
    internalBinaryWrite(message: GetIdentityBalanceAndRevisionResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionResponse
 */
export declare const GetIdentityBalanceAndRevisionResponse: GetIdentityBalanceAndRevisionResponse$Type;
declare class GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0$Type extends MessageType<GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0>): GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0): GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0;
    internalBinaryWrite(message: GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionResponse.GetIdentityBalanceAndRevisionResponseV0
 */
export declare const GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0: GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0$Type;
declare class GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0_BalanceAndRevision$Type extends MessageType<GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0_BalanceAndRevision> {
    constructor();
    create(value?: PartialMessage<GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0_BalanceAndRevision>): GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0_BalanceAndRevision;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0_BalanceAndRevision): GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0_BalanceAndRevision;
    internalBinaryWrite(message: GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0_BalanceAndRevision, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityBalanceAndRevisionResponse.GetIdentityBalanceAndRevisionResponseV0.BalanceAndRevision
 */
export declare const GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0_BalanceAndRevision: GetIdentityBalanceAndRevisionResponse_GetIdentityBalanceAndRevisionResponseV0_BalanceAndRevision$Type;
declare class KeyRequestType$Type extends MessageType<KeyRequestType> {
    constructor();
    create(value?: PartialMessage<KeyRequestType>): KeyRequestType;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: KeyRequestType): KeyRequestType;
    internalBinaryWrite(message: KeyRequestType, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.KeyRequestType
 */
export declare const KeyRequestType: KeyRequestType$Type;
declare class AllKeys$Type extends MessageType<AllKeys> {
    constructor();
    create(value?: PartialMessage<AllKeys>): AllKeys;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AllKeys): AllKeys;
    internalBinaryWrite(message: AllKeys, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.AllKeys
 */
export declare const AllKeys: AllKeys$Type;
declare class SpecificKeys$Type extends MessageType<SpecificKeys> {
    constructor();
    create(value?: PartialMessage<SpecificKeys>): SpecificKeys;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpecificKeys): SpecificKeys;
    internalBinaryWrite(message: SpecificKeys, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.SpecificKeys
 */
export declare const SpecificKeys: SpecificKeys$Type;
declare class SearchKey$Type extends MessageType<SearchKey> {
    constructor();
    create(value?: PartialMessage<SearchKey>): SearchKey;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SearchKey): SearchKey;
    private binaryReadMap1;
    internalBinaryWrite(message: SearchKey, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.SearchKey
 */
export declare const SearchKey: SearchKey$Type;
declare class SecurityLevelMap$Type extends MessageType<SecurityLevelMap> {
    constructor();
    create(value?: PartialMessage<SecurityLevelMap>): SecurityLevelMap;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SecurityLevelMap): SecurityLevelMap;
    private binaryReadMap1;
    internalBinaryWrite(message: SecurityLevelMap, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.SecurityLevelMap
 */
export declare const SecurityLevelMap: SecurityLevelMap$Type;
declare class GetIdentityKeysRequest$Type extends MessageType<GetIdentityKeysRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentityKeysRequest>): GetIdentityKeysRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityKeysRequest): GetIdentityKeysRequest;
    internalBinaryWrite(message: GetIdentityKeysRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityKeysRequest
 */
export declare const GetIdentityKeysRequest: GetIdentityKeysRequest$Type;
declare class GetIdentityKeysRequest_GetIdentityKeysRequestV0$Type extends MessageType<GetIdentityKeysRequest_GetIdentityKeysRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityKeysRequest_GetIdentityKeysRequestV0>): GetIdentityKeysRequest_GetIdentityKeysRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityKeysRequest_GetIdentityKeysRequestV0): GetIdentityKeysRequest_GetIdentityKeysRequestV0;
    internalBinaryWrite(message: GetIdentityKeysRequest_GetIdentityKeysRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityKeysRequest.GetIdentityKeysRequestV0
 */
export declare const GetIdentityKeysRequest_GetIdentityKeysRequestV0: GetIdentityKeysRequest_GetIdentityKeysRequestV0$Type;
declare class GetIdentityKeysResponse$Type extends MessageType<GetIdentityKeysResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentityKeysResponse>): GetIdentityKeysResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityKeysResponse): GetIdentityKeysResponse;
    internalBinaryWrite(message: GetIdentityKeysResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityKeysResponse
 */
export declare const GetIdentityKeysResponse: GetIdentityKeysResponse$Type;
declare class GetIdentityKeysResponse_GetIdentityKeysResponseV0$Type extends MessageType<GetIdentityKeysResponse_GetIdentityKeysResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityKeysResponse_GetIdentityKeysResponseV0>): GetIdentityKeysResponse_GetIdentityKeysResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityKeysResponse_GetIdentityKeysResponseV0): GetIdentityKeysResponse_GetIdentityKeysResponseV0;
    internalBinaryWrite(message: GetIdentityKeysResponse_GetIdentityKeysResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityKeysResponse.GetIdentityKeysResponseV0
 */
export declare const GetIdentityKeysResponse_GetIdentityKeysResponseV0: GetIdentityKeysResponse_GetIdentityKeysResponseV0$Type;
declare class GetIdentityKeysResponse_GetIdentityKeysResponseV0_Keys$Type extends MessageType<GetIdentityKeysResponse_GetIdentityKeysResponseV0_Keys> {
    constructor();
    create(value?: PartialMessage<GetIdentityKeysResponse_GetIdentityKeysResponseV0_Keys>): GetIdentityKeysResponse_GetIdentityKeysResponseV0_Keys;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityKeysResponse_GetIdentityKeysResponseV0_Keys): GetIdentityKeysResponse_GetIdentityKeysResponseV0_Keys;
    internalBinaryWrite(message: GetIdentityKeysResponse_GetIdentityKeysResponseV0_Keys, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityKeysResponse.GetIdentityKeysResponseV0.Keys
 */
export declare const GetIdentityKeysResponse_GetIdentityKeysResponseV0_Keys: GetIdentityKeysResponse_GetIdentityKeysResponseV0_Keys$Type;
declare class GetIdentitiesContractKeysRequest$Type extends MessageType<GetIdentitiesContractKeysRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesContractKeysRequest>): GetIdentitiesContractKeysRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesContractKeysRequest): GetIdentitiesContractKeysRequest;
    internalBinaryWrite(message: GetIdentitiesContractKeysRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysRequest
 */
export declare const GetIdentitiesContractKeysRequest: GetIdentitiesContractKeysRequest$Type;
declare class GetIdentitiesContractKeysRequest_GetIdentitiesContractKeysRequestV0$Type extends MessageType<GetIdentitiesContractKeysRequest_GetIdentitiesContractKeysRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesContractKeysRequest_GetIdentitiesContractKeysRequestV0>): GetIdentitiesContractKeysRequest_GetIdentitiesContractKeysRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesContractKeysRequest_GetIdentitiesContractKeysRequestV0): GetIdentitiesContractKeysRequest_GetIdentitiesContractKeysRequestV0;
    internalBinaryWrite(message: GetIdentitiesContractKeysRequest_GetIdentitiesContractKeysRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysRequest.GetIdentitiesContractKeysRequestV0
 */
export declare const GetIdentitiesContractKeysRequest_GetIdentitiesContractKeysRequestV0: GetIdentitiesContractKeysRequest_GetIdentitiesContractKeysRequestV0$Type;
declare class GetIdentitiesContractKeysResponse$Type extends MessageType<GetIdentitiesContractKeysResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesContractKeysResponse>): GetIdentitiesContractKeysResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesContractKeysResponse): GetIdentitiesContractKeysResponse;
    internalBinaryWrite(message: GetIdentitiesContractKeysResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse
 */
export declare const GetIdentitiesContractKeysResponse: GetIdentitiesContractKeysResponse$Type;
declare class GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0$Type extends MessageType<GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0>): GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0): GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0;
    internalBinaryWrite(message: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0
 */
export declare const GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0$Type;
declare class GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_PurposeKeys$Type extends MessageType<GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_PurposeKeys> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_PurposeKeys>): GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_PurposeKeys;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_PurposeKeys): GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_PurposeKeys;
    internalBinaryWrite(message: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_PurposeKeys, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0.PurposeKeys
 */
export declare const GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_PurposeKeys: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_PurposeKeys$Type;
declare class GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentityKeys$Type extends MessageType<GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentityKeys> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentityKeys>): GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentityKeys;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentityKeys): GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentityKeys;
    internalBinaryWrite(message: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentityKeys, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0.IdentityKeys
 */
export declare const GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentityKeys: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentityKeys$Type;
declare class GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentitiesKeys$Type extends MessageType<GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentitiesKeys> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentitiesKeys>): GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentitiesKeys;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentitiesKeys): GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentitiesKeys;
    internalBinaryWrite(message: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentitiesKeys, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesContractKeysResponse.GetIdentitiesContractKeysResponseV0.IdentitiesKeys
 */
export declare const GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentitiesKeys: GetIdentitiesContractKeysResponse_GetIdentitiesContractKeysResponseV0_IdentitiesKeys$Type;
declare class GetIdentitiesBalancesRequest$Type extends MessageType<GetIdentitiesBalancesRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesBalancesRequest>): GetIdentitiesBalancesRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesBalancesRequest): GetIdentitiesBalancesRequest;
    internalBinaryWrite(message: GetIdentitiesBalancesRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesRequest
 */
export declare const GetIdentitiesBalancesRequest: GetIdentitiesBalancesRequest$Type;
declare class GetIdentitiesBalancesRequest_GetIdentitiesBalancesRequestV0$Type extends MessageType<GetIdentitiesBalancesRequest_GetIdentitiesBalancesRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesBalancesRequest_GetIdentitiesBalancesRequestV0>): GetIdentitiesBalancesRequest_GetIdentitiesBalancesRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesBalancesRequest_GetIdentitiesBalancesRequestV0): GetIdentitiesBalancesRequest_GetIdentitiesBalancesRequestV0;
    internalBinaryWrite(message: GetIdentitiesBalancesRequest_GetIdentitiesBalancesRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesRequest.GetIdentitiesBalancesRequestV0
 */
export declare const GetIdentitiesBalancesRequest_GetIdentitiesBalancesRequestV0: GetIdentitiesBalancesRequest_GetIdentitiesBalancesRequestV0$Type;
declare class GetIdentitiesBalancesResponse$Type extends MessageType<GetIdentitiesBalancesResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesBalancesResponse>): GetIdentitiesBalancesResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesBalancesResponse): GetIdentitiesBalancesResponse;
    internalBinaryWrite(message: GetIdentitiesBalancesResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesResponse
 */
export declare const GetIdentitiesBalancesResponse: GetIdentitiesBalancesResponse$Type;
declare class GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0$Type extends MessageType<GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0>): GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0): GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0;
    internalBinaryWrite(message: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesResponse.GetIdentitiesBalancesResponseV0
 */
export declare const GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0$Type;
declare class GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentityBalance$Type extends MessageType<GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentityBalance> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentityBalance>): GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentityBalance;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentityBalance): GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentityBalance;
    internalBinaryWrite(message: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentityBalance, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesResponse.GetIdentitiesBalancesResponseV0.IdentityBalance
 */
export declare const GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentityBalance: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentityBalance$Type;
declare class GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentitiesBalances$Type extends MessageType<GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentitiesBalances> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentitiesBalances>): GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentitiesBalances;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentitiesBalances): GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentitiesBalances;
    internalBinaryWrite(message: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentitiesBalances, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesBalancesResponse.GetIdentitiesBalancesResponseV0.IdentitiesBalances
 */
export declare const GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentitiesBalances: GetIdentitiesBalancesResponse_GetIdentitiesBalancesResponseV0_IdentitiesBalances$Type;
declare class GetDataContractRequest$Type extends MessageType<GetDataContractRequest> {
    constructor();
    create(value?: PartialMessage<GetDataContractRequest>): GetDataContractRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetDataContractRequest): GetDataContractRequest;
    internalBinaryWrite(message: GetDataContractRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetDataContractRequest
 */
export declare const GetDataContractRequest: GetDataContractRequest$Type;
declare class GetDataContractRequest_GetDataContractRequestV0$Type extends MessageType<GetDataContractRequest_GetDataContractRequestV0> {
    constructor();
    create(value?: PartialMessage<GetDataContractRequest_GetDataContractRequestV0>): GetDataContractRequest_GetDataContractRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetDataContractRequest_GetDataContractRequestV0): GetDataContractRequest_GetDataContractRequestV0;
    internalBinaryWrite(message: GetDataContractRequest_GetDataContractRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetDataContractRequest.GetDataContractRequestV0
 */
export declare const GetDataContractRequest_GetDataContractRequestV0: GetDataContractRequest_GetDataContractRequestV0$Type;
declare class GetDataContractResponse$Type extends MessageType<GetDataContractResponse> {
    constructor();
    create(value?: PartialMessage<GetDataContractResponse>): GetDataContractResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetDataContractResponse): GetDataContractResponse;
    internalBinaryWrite(message: GetDataContractResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetDataContractResponse
 */
export declare const GetDataContractResponse: GetDataContractResponse$Type;
declare class GetDataContractResponse_GetDataContractResponseV0$Type extends MessageType<GetDataContractResponse_GetDataContractResponseV0> {
    constructor();
    create(value?: PartialMessage<GetDataContractResponse_GetDataContractResponseV0>): GetDataContractResponse_GetDataContractResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetDataContractResponse_GetDataContractResponseV0): GetDataContractResponse_GetDataContractResponseV0;
    internalBinaryWrite(message: GetDataContractResponse_GetDataContractResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetDataContractResponse.GetDataContractResponseV0
 */
export declare const GetDataContractResponse_GetDataContractResponseV0: GetDataContractResponse_GetDataContractResponseV0$Type;
declare class GetDocumentsRequest$Type extends MessageType<GetDocumentsRequest> {
    constructor();
    create(value?: PartialMessage<GetDocumentsRequest>): GetDocumentsRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetDocumentsRequest): GetDocumentsRequest;
    internalBinaryWrite(message: GetDocumentsRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetDocumentsRequest
 */
export declare const GetDocumentsRequest: GetDocumentsRequest$Type;
declare class GetDocumentsRequest_GetDocumentsRequestV0$Type extends MessageType<GetDocumentsRequest_GetDocumentsRequestV0> {
    constructor();
    create(value?: PartialMessage<GetDocumentsRequest_GetDocumentsRequestV0>): GetDocumentsRequest_GetDocumentsRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetDocumentsRequest_GetDocumentsRequestV0): GetDocumentsRequest_GetDocumentsRequestV0;
    internalBinaryWrite(message: GetDocumentsRequest_GetDocumentsRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetDocumentsRequest.GetDocumentsRequestV0
 */
export declare const GetDocumentsRequest_GetDocumentsRequestV0: GetDocumentsRequest_GetDocumentsRequestV0$Type;
declare class GetDocumentsResponse$Type extends MessageType<GetDocumentsResponse> {
    constructor();
    create(value?: PartialMessage<GetDocumentsResponse>): GetDocumentsResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetDocumentsResponse): GetDocumentsResponse;
    internalBinaryWrite(message: GetDocumentsResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetDocumentsResponse
 */
export declare const GetDocumentsResponse: GetDocumentsResponse$Type;
declare class GetDocumentsResponse_GetDocumentsResponseV0$Type extends MessageType<GetDocumentsResponse_GetDocumentsResponseV0> {
    constructor();
    create(value?: PartialMessage<GetDocumentsResponse_GetDocumentsResponseV0>): GetDocumentsResponse_GetDocumentsResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetDocumentsResponse_GetDocumentsResponseV0): GetDocumentsResponse_GetDocumentsResponseV0;
    internalBinaryWrite(message: GetDocumentsResponse_GetDocumentsResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetDocumentsResponse.GetDocumentsResponseV0
 */
export declare const GetDocumentsResponse_GetDocumentsResponseV0: GetDocumentsResponse_GetDocumentsResponseV0$Type;
declare class GetDocumentsResponse_GetDocumentsResponseV0_Documents$Type extends MessageType<GetDocumentsResponse_GetDocumentsResponseV0_Documents> {
    constructor();
    create(value?: PartialMessage<GetDocumentsResponse_GetDocumentsResponseV0_Documents>): GetDocumentsResponse_GetDocumentsResponseV0_Documents;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetDocumentsResponse_GetDocumentsResponseV0_Documents): GetDocumentsResponse_GetDocumentsResponseV0_Documents;
    internalBinaryWrite(message: GetDocumentsResponse_GetDocumentsResponseV0_Documents, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetDocumentsResponse.GetDocumentsResponseV0.Documents
 */
export declare const GetDocumentsResponse_GetDocumentsResponseV0_Documents: GetDocumentsResponse_GetDocumentsResponseV0_Documents$Type;
declare class GetIdentityByPublicKeyHashRequest$Type extends MessageType<GetIdentityByPublicKeyHashRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentityByPublicKeyHashRequest>): GetIdentityByPublicKeyHashRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityByPublicKeyHashRequest): GetIdentityByPublicKeyHashRequest;
    internalBinaryWrite(message: GetIdentityByPublicKeyHashRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityByPublicKeyHashRequest
 */
export declare const GetIdentityByPublicKeyHashRequest: GetIdentityByPublicKeyHashRequest$Type;
declare class GetIdentityByPublicKeyHashRequest_GetIdentityByPublicKeyHashRequestV0$Type extends MessageType<GetIdentityByPublicKeyHashRequest_GetIdentityByPublicKeyHashRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityByPublicKeyHashRequest_GetIdentityByPublicKeyHashRequestV0>): GetIdentityByPublicKeyHashRequest_GetIdentityByPublicKeyHashRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityByPublicKeyHashRequest_GetIdentityByPublicKeyHashRequestV0): GetIdentityByPublicKeyHashRequest_GetIdentityByPublicKeyHashRequestV0;
    internalBinaryWrite(message: GetIdentityByPublicKeyHashRequest_GetIdentityByPublicKeyHashRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityByPublicKeyHashRequest.GetIdentityByPublicKeyHashRequestV0
 */
export declare const GetIdentityByPublicKeyHashRequest_GetIdentityByPublicKeyHashRequestV0: GetIdentityByPublicKeyHashRequest_GetIdentityByPublicKeyHashRequestV0$Type;
declare class GetIdentityByPublicKeyHashResponse$Type extends MessageType<GetIdentityByPublicKeyHashResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentityByPublicKeyHashResponse>): GetIdentityByPublicKeyHashResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityByPublicKeyHashResponse): GetIdentityByPublicKeyHashResponse;
    internalBinaryWrite(message: GetIdentityByPublicKeyHashResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityByPublicKeyHashResponse
 */
export declare const GetIdentityByPublicKeyHashResponse: GetIdentityByPublicKeyHashResponse$Type;
declare class GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0$Type extends MessageType<GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0>): GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0): GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0;
    internalBinaryWrite(message: GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityByPublicKeyHashResponse.GetIdentityByPublicKeyHashResponseV0
 */
export declare const GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0: GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0$Type;
declare class GetIdentityByNonUniquePublicKeyHashRequest$Type extends MessageType<GetIdentityByNonUniquePublicKeyHashRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentityByNonUniquePublicKeyHashRequest>): GetIdentityByNonUniquePublicKeyHashRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityByNonUniquePublicKeyHashRequest): GetIdentityByNonUniquePublicKeyHashRequest;
    internalBinaryWrite(message: GetIdentityByNonUniquePublicKeyHashRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashRequest
 */
export declare const GetIdentityByNonUniquePublicKeyHashRequest: GetIdentityByNonUniquePublicKeyHashRequest$Type;
declare class GetIdentityByNonUniquePublicKeyHashRequest_GetIdentityByNonUniquePublicKeyHashRequestV0$Type extends MessageType<GetIdentityByNonUniquePublicKeyHashRequest_GetIdentityByNonUniquePublicKeyHashRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityByNonUniquePublicKeyHashRequest_GetIdentityByNonUniquePublicKeyHashRequestV0>): GetIdentityByNonUniquePublicKeyHashRequest_GetIdentityByNonUniquePublicKeyHashRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityByNonUniquePublicKeyHashRequest_GetIdentityByNonUniquePublicKeyHashRequestV0): GetIdentityByNonUniquePublicKeyHashRequest_GetIdentityByNonUniquePublicKeyHashRequestV0;
    internalBinaryWrite(message: GetIdentityByNonUniquePublicKeyHashRequest_GetIdentityByNonUniquePublicKeyHashRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashRequest.GetIdentityByNonUniquePublicKeyHashRequestV0
 */
export declare const GetIdentityByNonUniquePublicKeyHashRequest_GetIdentityByNonUniquePublicKeyHashRequestV0: GetIdentityByNonUniquePublicKeyHashRequest_GetIdentityByNonUniquePublicKeyHashRequestV0$Type;
declare class GetIdentityByNonUniquePublicKeyHashResponse$Type extends MessageType<GetIdentityByNonUniquePublicKeyHashResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentityByNonUniquePublicKeyHashResponse>): GetIdentityByNonUniquePublicKeyHashResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityByNonUniquePublicKeyHashResponse): GetIdentityByNonUniquePublicKeyHashResponse;
    internalBinaryWrite(message: GetIdentityByNonUniquePublicKeyHashResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashResponse
 */
export declare const GetIdentityByNonUniquePublicKeyHashResponse: GetIdentityByNonUniquePublicKeyHashResponse$Type;
declare class GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0$Type extends MessageType<GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0>): GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0): GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0;
    internalBinaryWrite(message: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashResponse.GetIdentityByNonUniquePublicKeyHashResponseV0
 */
export declare const GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0$Type;
declare class GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityResponse$Type extends MessageType<GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityResponse>): GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityResponse): GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityResponse;
    internalBinaryWrite(message: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashResponse.GetIdentityByNonUniquePublicKeyHashResponseV0.IdentityResponse
 */
export declare const GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityResponse: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityResponse$Type;
declare class GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityProvedResponse$Type extends MessageType<GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityProvedResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityProvedResponse>): GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityProvedResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityProvedResponse): GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityProvedResponse;
    internalBinaryWrite(message: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityProvedResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityByNonUniquePublicKeyHashResponse.GetIdentityByNonUniquePublicKeyHashResponseV0.IdentityProvedResponse
 */
export declare const GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityProvedResponse: GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0_IdentityProvedResponse$Type;
declare class GetEpochsInfoRequest$Type extends MessageType<GetEpochsInfoRequest> {
    constructor();
    create(value?: PartialMessage<GetEpochsInfoRequest>): GetEpochsInfoRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetEpochsInfoRequest): GetEpochsInfoRequest;
    internalBinaryWrite(message: GetEpochsInfoRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetEpochsInfoRequest
 */
export declare const GetEpochsInfoRequest: GetEpochsInfoRequest$Type;
declare class GetEpochsInfoRequest_GetEpochsInfoRequestV0$Type extends MessageType<GetEpochsInfoRequest_GetEpochsInfoRequestV0> {
    constructor();
    create(value?: PartialMessage<GetEpochsInfoRequest_GetEpochsInfoRequestV0>): GetEpochsInfoRequest_GetEpochsInfoRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetEpochsInfoRequest_GetEpochsInfoRequestV0): GetEpochsInfoRequest_GetEpochsInfoRequestV0;
    internalBinaryWrite(message: GetEpochsInfoRequest_GetEpochsInfoRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetEpochsInfoRequest.GetEpochsInfoRequestV0
 */
export declare const GetEpochsInfoRequest_GetEpochsInfoRequestV0: GetEpochsInfoRequest_GetEpochsInfoRequestV0$Type;
declare class GetEpochsInfoResponse$Type extends MessageType<GetEpochsInfoResponse> {
    constructor();
    create(value?: PartialMessage<GetEpochsInfoResponse>): GetEpochsInfoResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetEpochsInfoResponse): GetEpochsInfoResponse;
    internalBinaryWrite(message: GetEpochsInfoResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetEpochsInfoResponse
 */
export declare const GetEpochsInfoResponse: GetEpochsInfoResponse$Type;
declare class GetEpochsInfoResponse_GetEpochsInfoResponseV0$Type extends MessageType<GetEpochsInfoResponse_GetEpochsInfoResponseV0> {
    constructor();
    create(value?: PartialMessage<GetEpochsInfoResponse_GetEpochsInfoResponseV0>): GetEpochsInfoResponse_GetEpochsInfoResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetEpochsInfoResponse_GetEpochsInfoResponseV0): GetEpochsInfoResponse_GetEpochsInfoResponseV0;
    internalBinaryWrite(message: GetEpochsInfoResponse_GetEpochsInfoResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetEpochsInfoResponse.GetEpochsInfoResponseV0
 */
export declare const GetEpochsInfoResponse_GetEpochsInfoResponseV0: GetEpochsInfoResponse_GetEpochsInfoResponseV0$Type;
declare class GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfos$Type extends MessageType<GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfos> {
    constructor();
    create(value?: PartialMessage<GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfos>): GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfos;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfos): GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfos;
    internalBinaryWrite(message: GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfos, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetEpochsInfoResponse.GetEpochsInfoResponseV0.EpochInfos
 */
export declare const GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfos: GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfos$Type;
declare class GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo$Type extends MessageType<GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo> {
    constructor();
    create(value?: PartialMessage<GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo>): GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo): GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo;
    internalBinaryWrite(message: GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetEpochsInfoResponse.GetEpochsInfoResponseV0.EpochInfo
 */
export declare const GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo: GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo$Type;
declare class GetContestedResourcesRequest$Type extends MessageType<GetContestedResourcesRequest> {
    constructor();
    create(value?: PartialMessage<GetContestedResourcesRequest>): GetContestedResourcesRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourcesRequest): GetContestedResourcesRequest;
    internalBinaryWrite(message: GetContestedResourcesRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourcesRequest
 */
export declare const GetContestedResourcesRequest: GetContestedResourcesRequest$Type;
declare class GetContestedResourcesRequest_GetContestedResourcesRequestV0$Type extends MessageType<GetContestedResourcesRequest_GetContestedResourcesRequestV0> {
    constructor();
    create(value?: PartialMessage<GetContestedResourcesRequest_GetContestedResourcesRequestV0>): GetContestedResourcesRequest_GetContestedResourcesRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourcesRequest_GetContestedResourcesRequestV0): GetContestedResourcesRequest_GetContestedResourcesRequestV0;
    internalBinaryWrite(message: GetContestedResourcesRequest_GetContestedResourcesRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourcesRequest.GetContestedResourcesRequestV0
 */
export declare const GetContestedResourcesRequest_GetContestedResourcesRequestV0: GetContestedResourcesRequest_GetContestedResourcesRequestV0$Type;
declare class GetContestedResourcesRequest_GetContestedResourcesRequestV0_StartAtValueInfo$Type extends MessageType<GetContestedResourcesRequest_GetContestedResourcesRequestV0_StartAtValueInfo> {
    constructor();
    create(value?: PartialMessage<GetContestedResourcesRequest_GetContestedResourcesRequestV0_StartAtValueInfo>): GetContestedResourcesRequest_GetContestedResourcesRequestV0_StartAtValueInfo;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourcesRequest_GetContestedResourcesRequestV0_StartAtValueInfo): GetContestedResourcesRequest_GetContestedResourcesRequestV0_StartAtValueInfo;
    internalBinaryWrite(message: GetContestedResourcesRequest_GetContestedResourcesRequestV0_StartAtValueInfo, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourcesRequest.GetContestedResourcesRequestV0.StartAtValueInfo
 */
export declare const GetContestedResourcesRequest_GetContestedResourcesRequestV0_StartAtValueInfo: GetContestedResourcesRequest_GetContestedResourcesRequestV0_StartAtValueInfo$Type;
declare class GetContestedResourcesResponse$Type extends MessageType<GetContestedResourcesResponse> {
    constructor();
    create(value?: PartialMessage<GetContestedResourcesResponse>): GetContestedResourcesResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourcesResponse): GetContestedResourcesResponse;
    internalBinaryWrite(message: GetContestedResourcesResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourcesResponse
 */
export declare const GetContestedResourcesResponse: GetContestedResourcesResponse$Type;
declare class GetContestedResourcesResponse_GetContestedResourcesResponseV0$Type extends MessageType<GetContestedResourcesResponse_GetContestedResourcesResponseV0> {
    constructor();
    create(value?: PartialMessage<GetContestedResourcesResponse_GetContestedResourcesResponseV0>): GetContestedResourcesResponse_GetContestedResourcesResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourcesResponse_GetContestedResourcesResponseV0): GetContestedResourcesResponse_GetContestedResourcesResponseV0;
    internalBinaryWrite(message: GetContestedResourcesResponse_GetContestedResourcesResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourcesResponse.GetContestedResourcesResponseV0
 */
export declare const GetContestedResourcesResponse_GetContestedResourcesResponseV0: GetContestedResourcesResponse_GetContestedResourcesResponseV0$Type;
declare class GetContestedResourcesResponse_GetContestedResourcesResponseV0_ContestedResourceValues$Type extends MessageType<GetContestedResourcesResponse_GetContestedResourcesResponseV0_ContestedResourceValues> {
    constructor();
    create(value?: PartialMessage<GetContestedResourcesResponse_GetContestedResourcesResponseV0_ContestedResourceValues>): GetContestedResourcesResponse_GetContestedResourcesResponseV0_ContestedResourceValues;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourcesResponse_GetContestedResourcesResponseV0_ContestedResourceValues): GetContestedResourcesResponse_GetContestedResourcesResponseV0_ContestedResourceValues;
    internalBinaryWrite(message: GetContestedResourcesResponse_GetContestedResourcesResponseV0_ContestedResourceValues, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourcesResponse.GetContestedResourcesResponseV0.ContestedResourceValues
 */
export declare const GetContestedResourcesResponse_GetContestedResourcesResponseV0_ContestedResourceValues: GetContestedResourcesResponse_GetContestedResourcesResponseV0_ContestedResourceValues$Type;
declare class GetContestedResourceVoteStateRequest$Type extends MessageType<GetContestedResourceVoteStateRequest> {
    constructor();
    create(value?: PartialMessage<GetContestedResourceVoteStateRequest>): GetContestedResourceVoteStateRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourceVoteStateRequest): GetContestedResourceVoteStateRequest;
    internalBinaryWrite(message: GetContestedResourceVoteStateRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateRequest
 */
export declare const GetContestedResourceVoteStateRequest: GetContestedResourceVoteStateRequest$Type;
declare class GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0$Type extends MessageType<GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0> {
    constructor();
    create(value?: PartialMessage<GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0>): GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0): GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0;
    internalBinaryWrite(message: GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateRequest.GetContestedResourceVoteStateRequestV0
 */
export declare const GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0: GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0$Type;
declare class GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo$Type extends MessageType<GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo> {
    constructor();
    create(value?: PartialMessage<GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo>): GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo): GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo;
    internalBinaryWrite(message: GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateRequest.GetContestedResourceVoteStateRequestV0.StartAtIdentifierInfo
 */
export declare const GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo: GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo$Type;
declare class GetContestedResourceVoteStateResponse$Type extends MessageType<GetContestedResourceVoteStateResponse> {
    constructor();
    create(value?: PartialMessage<GetContestedResourceVoteStateResponse>): GetContestedResourceVoteStateResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourceVoteStateResponse): GetContestedResourceVoteStateResponse;
    internalBinaryWrite(message: GetContestedResourceVoteStateResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse
 */
export declare const GetContestedResourceVoteStateResponse: GetContestedResourceVoteStateResponse$Type;
declare class GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0$Type extends MessageType<GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0> {
    constructor();
    create(value?: PartialMessage<GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0>): GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0): GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0;
    internalBinaryWrite(message: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0
 */
export declare const GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0$Type;
declare class GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo$Type extends MessageType<GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo> {
    constructor();
    create(value?: PartialMessage<GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo>): GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo): GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo;
    internalBinaryWrite(message: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0.FinishedVoteInfo
 */
export declare const GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo$Type;
declare class GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders$Type extends MessageType<GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders> {
    constructor();
    create(value?: PartialMessage<GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders>): GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders): GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders;
    internalBinaryWrite(message: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0.ContestedResourceContenders
 */
export declare const GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders$Type;
declare class GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_Contender$Type extends MessageType<GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_Contender> {
    constructor();
    create(value?: PartialMessage<GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_Contender>): GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_Contender;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_Contender): GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_Contender;
    internalBinaryWrite(message: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_Contender, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetContestedResourceVoteStateResponse.GetContestedResourceVoteStateResponseV0.Contender
 */
export declare const GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_Contender: GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_Contender$Type;
declare class GetTotalCreditsInPlatformRequest$Type extends MessageType<GetTotalCreditsInPlatformRequest> {
    constructor();
    create(value?: PartialMessage<GetTotalCreditsInPlatformRequest>): GetTotalCreditsInPlatformRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTotalCreditsInPlatformRequest): GetTotalCreditsInPlatformRequest;
    internalBinaryWrite(message: GetTotalCreditsInPlatformRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTotalCreditsInPlatformRequest
 */
export declare const GetTotalCreditsInPlatformRequest: GetTotalCreditsInPlatformRequest$Type;
declare class GetTotalCreditsInPlatformRequest_GetTotalCreditsInPlatformRequestV0$Type extends MessageType<GetTotalCreditsInPlatformRequest_GetTotalCreditsInPlatformRequestV0> {
    constructor();
    create(value?: PartialMessage<GetTotalCreditsInPlatformRequest_GetTotalCreditsInPlatformRequestV0>): GetTotalCreditsInPlatformRequest_GetTotalCreditsInPlatformRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTotalCreditsInPlatformRequest_GetTotalCreditsInPlatformRequestV0): GetTotalCreditsInPlatformRequest_GetTotalCreditsInPlatformRequestV0;
    internalBinaryWrite(message: GetTotalCreditsInPlatformRequest_GetTotalCreditsInPlatformRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTotalCreditsInPlatformRequest.GetTotalCreditsInPlatformRequestV0
 */
export declare const GetTotalCreditsInPlatformRequest_GetTotalCreditsInPlatformRequestV0: GetTotalCreditsInPlatformRequest_GetTotalCreditsInPlatformRequestV0$Type;
declare class GetTotalCreditsInPlatformResponse$Type extends MessageType<GetTotalCreditsInPlatformResponse> {
    constructor();
    create(value?: PartialMessage<GetTotalCreditsInPlatformResponse>): GetTotalCreditsInPlatformResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTotalCreditsInPlatformResponse): GetTotalCreditsInPlatformResponse;
    internalBinaryWrite(message: GetTotalCreditsInPlatformResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTotalCreditsInPlatformResponse
 */
export declare const GetTotalCreditsInPlatformResponse: GetTotalCreditsInPlatformResponse$Type;
declare class GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0$Type extends MessageType<GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0> {
    constructor();
    create(value?: PartialMessage<GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0>): GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0): GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0;
    internalBinaryWrite(message: GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTotalCreditsInPlatformResponse.GetTotalCreditsInPlatformResponseV0
 */
export declare const GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0: GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0$Type;
declare class GetStatusRequest$Type extends MessageType<GetStatusRequest> {
    constructor();
    create(value?: PartialMessage<GetStatusRequest>): GetStatusRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusRequest): GetStatusRequest;
    internalBinaryWrite(message: GetStatusRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusRequest
 */
export declare const GetStatusRequest: GetStatusRequest$Type;
declare class GetStatusRequest_GetStatusRequestV0$Type extends MessageType<GetStatusRequest_GetStatusRequestV0> {
    constructor();
    create(value?: PartialMessage<GetStatusRequest_GetStatusRequestV0>): GetStatusRequest_GetStatusRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusRequest_GetStatusRequestV0): GetStatusRequest_GetStatusRequestV0;
    internalBinaryWrite(message: GetStatusRequest_GetStatusRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusRequest.GetStatusRequestV0
 */
export declare const GetStatusRequest_GetStatusRequestV0: GetStatusRequest_GetStatusRequestV0$Type;
declare class GetStatusResponse$Type extends MessageType<GetStatusResponse> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse>): GetStatusResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse): GetStatusResponse;
    internalBinaryWrite(message: GetStatusResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse
 */
export declare const GetStatusResponse: GetStatusResponse$Type;
declare class GetStatusResponse_GetStatusResponseV0$Type extends MessageType<GetStatusResponse_GetStatusResponseV0> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse_GetStatusResponseV0>): GetStatusResponse_GetStatusResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse_GetStatusResponseV0): GetStatusResponse_GetStatusResponseV0;
    internalBinaryWrite(message: GetStatusResponse_GetStatusResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0
 */
export declare const GetStatusResponse_GetStatusResponseV0: GetStatusResponse_GetStatusResponseV0$Type;
declare class GetStatusResponse_GetStatusResponseV0_Version$Type extends MessageType<GetStatusResponse_GetStatusResponseV0_Version> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse_GetStatusResponseV0_Version>): GetStatusResponse_GetStatusResponseV0_Version;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse_GetStatusResponseV0_Version): GetStatusResponse_GetStatusResponseV0_Version;
    internalBinaryWrite(message: GetStatusResponse_GetStatusResponseV0_Version, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version
 */
export declare const GetStatusResponse_GetStatusResponseV0_Version: GetStatusResponse_GetStatusResponseV0_Version$Type;
declare class GetStatusResponse_GetStatusResponseV0_Version_Software$Type extends MessageType<GetStatusResponse_GetStatusResponseV0_Version_Software> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse_GetStatusResponseV0_Version_Software>): GetStatusResponse_GetStatusResponseV0_Version_Software;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse_GetStatusResponseV0_Version_Software): GetStatusResponse_GetStatusResponseV0_Version_Software;
    internalBinaryWrite(message: GetStatusResponse_GetStatusResponseV0_Version_Software, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Software
 */
export declare const GetStatusResponse_GetStatusResponseV0_Version_Software: GetStatusResponse_GetStatusResponseV0_Version_Software$Type;
declare class GetStatusResponse_GetStatusResponseV0_Version_Protocol$Type extends MessageType<GetStatusResponse_GetStatusResponseV0_Version_Protocol> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse_GetStatusResponseV0_Version_Protocol>): GetStatusResponse_GetStatusResponseV0_Version_Protocol;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse_GetStatusResponseV0_Version_Protocol): GetStatusResponse_GetStatusResponseV0_Version_Protocol;
    internalBinaryWrite(message: GetStatusResponse_GetStatusResponseV0_Version_Protocol, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Protocol
 */
export declare const GetStatusResponse_GetStatusResponseV0_Version_Protocol: GetStatusResponse_GetStatusResponseV0_Version_Protocol$Type;
declare class GetStatusResponse_GetStatusResponseV0_Version_Protocol_Tenderdash$Type extends MessageType<GetStatusResponse_GetStatusResponseV0_Version_Protocol_Tenderdash> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse_GetStatusResponseV0_Version_Protocol_Tenderdash>): GetStatusResponse_GetStatusResponseV0_Version_Protocol_Tenderdash;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse_GetStatusResponseV0_Version_Protocol_Tenderdash): GetStatusResponse_GetStatusResponseV0_Version_Protocol_Tenderdash;
    internalBinaryWrite(message: GetStatusResponse_GetStatusResponseV0_Version_Protocol_Tenderdash, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Protocol.Tenderdash
 */
export declare const GetStatusResponse_GetStatusResponseV0_Version_Protocol_Tenderdash: GetStatusResponse_GetStatusResponseV0_Version_Protocol_Tenderdash$Type;
declare class GetStatusResponse_GetStatusResponseV0_Version_Protocol_Drive$Type extends MessageType<GetStatusResponse_GetStatusResponseV0_Version_Protocol_Drive> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse_GetStatusResponseV0_Version_Protocol_Drive>): GetStatusResponse_GetStatusResponseV0_Version_Protocol_Drive;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse_GetStatusResponseV0_Version_Protocol_Drive): GetStatusResponse_GetStatusResponseV0_Version_Protocol_Drive;
    internalBinaryWrite(message: GetStatusResponse_GetStatusResponseV0_Version_Protocol_Drive, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Version.Protocol.Drive
 */
export declare const GetStatusResponse_GetStatusResponseV0_Version_Protocol_Drive: GetStatusResponse_GetStatusResponseV0_Version_Protocol_Drive$Type;
declare class GetStatusResponse_GetStatusResponseV0_Time$Type extends MessageType<GetStatusResponse_GetStatusResponseV0_Time> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse_GetStatusResponseV0_Time>): GetStatusResponse_GetStatusResponseV0_Time;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse_GetStatusResponseV0_Time): GetStatusResponse_GetStatusResponseV0_Time;
    internalBinaryWrite(message: GetStatusResponse_GetStatusResponseV0_Time, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Time
 */
export declare const GetStatusResponse_GetStatusResponseV0_Time: GetStatusResponse_GetStatusResponseV0_Time$Type;
declare class GetStatusResponse_GetStatusResponseV0_Node$Type extends MessageType<GetStatusResponse_GetStatusResponseV0_Node> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse_GetStatusResponseV0_Node>): GetStatusResponse_GetStatusResponseV0_Node;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse_GetStatusResponseV0_Node): GetStatusResponse_GetStatusResponseV0_Node;
    internalBinaryWrite(message: GetStatusResponse_GetStatusResponseV0_Node, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Node
 */
export declare const GetStatusResponse_GetStatusResponseV0_Node: GetStatusResponse_GetStatusResponseV0_Node$Type;
declare class GetStatusResponse_GetStatusResponseV0_Chain$Type extends MessageType<GetStatusResponse_GetStatusResponseV0_Chain> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse_GetStatusResponseV0_Chain>): GetStatusResponse_GetStatusResponseV0_Chain;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse_GetStatusResponseV0_Chain): GetStatusResponse_GetStatusResponseV0_Chain;
    internalBinaryWrite(message: GetStatusResponse_GetStatusResponseV0_Chain, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Chain
 */
export declare const GetStatusResponse_GetStatusResponseV0_Chain: GetStatusResponse_GetStatusResponseV0_Chain$Type;
declare class GetStatusResponse_GetStatusResponseV0_Network$Type extends MessageType<GetStatusResponse_GetStatusResponseV0_Network> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse_GetStatusResponseV0_Network>): GetStatusResponse_GetStatusResponseV0_Network;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse_GetStatusResponseV0_Network): GetStatusResponse_GetStatusResponseV0_Network;
    internalBinaryWrite(message: GetStatusResponse_GetStatusResponseV0_Network, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.Network
 */
export declare const GetStatusResponse_GetStatusResponseV0_Network: GetStatusResponse_GetStatusResponseV0_Network$Type;
declare class GetStatusResponse_GetStatusResponseV0_StateSync$Type extends MessageType<GetStatusResponse_GetStatusResponseV0_StateSync> {
    constructor();
    create(value?: PartialMessage<GetStatusResponse_GetStatusResponseV0_StateSync>): GetStatusResponse_GetStatusResponseV0_StateSync;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStatusResponse_GetStatusResponseV0_StateSync): GetStatusResponse_GetStatusResponseV0_StateSync;
    internalBinaryWrite(message: GetStatusResponse_GetStatusResponseV0_StateSync, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetStatusResponse.GetStatusResponseV0.StateSync
 */
export declare const GetStatusResponse_GetStatusResponseV0_StateSync: GetStatusResponse_GetStatusResponseV0_StateSync$Type;
declare class GetIdentityTokenBalancesRequest$Type extends MessageType<GetIdentityTokenBalancesRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentityTokenBalancesRequest>): GetIdentityTokenBalancesRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityTokenBalancesRequest): GetIdentityTokenBalancesRequest;
    internalBinaryWrite(message: GetIdentityTokenBalancesRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesRequest
 */
export declare const GetIdentityTokenBalancesRequest: GetIdentityTokenBalancesRequest$Type;
declare class GetIdentityTokenBalancesRequest_GetIdentityTokenBalancesRequestV0$Type extends MessageType<GetIdentityTokenBalancesRequest_GetIdentityTokenBalancesRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityTokenBalancesRequest_GetIdentityTokenBalancesRequestV0>): GetIdentityTokenBalancesRequest_GetIdentityTokenBalancesRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityTokenBalancesRequest_GetIdentityTokenBalancesRequestV0): GetIdentityTokenBalancesRequest_GetIdentityTokenBalancesRequestV0;
    internalBinaryWrite(message: GetIdentityTokenBalancesRequest_GetIdentityTokenBalancesRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesRequest.GetIdentityTokenBalancesRequestV0
 */
export declare const GetIdentityTokenBalancesRequest_GetIdentityTokenBalancesRequestV0: GetIdentityTokenBalancesRequest_GetIdentityTokenBalancesRequestV0$Type;
declare class GetIdentityTokenBalancesResponse$Type extends MessageType<GetIdentityTokenBalancesResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentityTokenBalancesResponse>): GetIdentityTokenBalancesResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityTokenBalancesResponse): GetIdentityTokenBalancesResponse;
    internalBinaryWrite(message: GetIdentityTokenBalancesResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesResponse
 */
export declare const GetIdentityTokenBalancesResponse: GetIdentityTokenBalancesResponse$Type;
declare class GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0$Type extends MessageType<GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0>): GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0): GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0;
    internalBinaryWrite(message: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesResponse.GetIdentityTokenBalancesResponseV0
 */
export declare const GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0$Type;
declare class GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalanceEntry$Type extends MessageType<GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalanceEntry> {
    constructor();
    create(value?: PartialMessage<GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalanceEntry>): GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalanceEntry;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalanceEntry): GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalanceEntry;
    internalBinaryWrite(message: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalanceEntry, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesResponse.GetIdentityTokenBalancesResponseV0.TokenBalanceEntry
 */
export declare const GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalanceEntry: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalanceEntry$Type;
declare class GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances$Type extends MessageType<GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances> {
    constructor();
    create(value?: PartialMessage<GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances>): GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances): GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances;
    internalBinaryWrite(message: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentityTokenBalancesResponse.GetIdentityTokenBalancesResponseV0.TokenBalances
 */
export declare const GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances: GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances$Type;
declare class GetIdentitiesTokenBalancesRequest$Type extends MessageType<GetIdentitiesTokenBalancesRequest> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesTokenBalancesRequest>): GetIdentitiesTokenBalancesRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesTokenBalancesRequest): GetIdentitiesTokenBalancesRequest;
    internalBinaryWrite(message: GetIdentitiesTokenBalancesRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesRequest
 */
export declare const GetIdentitiesTokenBalancesRequest: GetIdentitiesTokenBalancesRequest$Type;
declare class GetIdentitiesTokenBalancesRequest_GetIdentitiesTokenBalancesRequestV0$Type extends MessageType<GetIdentitiesTokenBalancesRequest_GetIdentitiesTokenBalancesRequestV0> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesTokenBalancesRequest_GetIdentitiesTokenBalancesRequestV0>): GetIdentitiesTokenBalancesRequest_GetIdentitiesTokenBalancesRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesTokenBalancesRequest_GetIdentitiesTokenBalancesRequestV0): GetIdentitiesTokenBalancesRequest_GetIdentitiesTokenBalancesRequestV0;
    internalBinaryWrite(message: GetIdentitiesTokenBalancesRequest_GetIdentitiesTokenBalancesRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesRequest.GetIdentitiesTokenBalancesRequestV0
 */
export declare const GetIdentitiesTokenBalancesRequest_GetIdentitiesTokenBalancesRequestV0: GetIdentitiesTokenBalancesRequest_GetIdentitiesTokenBalancesRequestV0$Type;
declare class GetIdentitiesTokenBalancesResponse$Type extends MessageType<GetIdentitiesTokenBalancesResponse> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesTokenBalancesResponse>): GetIdentitiesTokenBalancesResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesTokenBalancesResponse): GetIdentitiesTokenBalancesResponse;
    internalBinaryWrite(message: GetIdentitiesTokenBalancesResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesResponse
 */
export declare const GetIdentitiesTokenBalancesResponse: GetIdentitiesTokenBalancesResponse$Type;
declare class GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0$Type extends MessageType<GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0>): GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0): GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0;
    internalBinaryWrite(message: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesResponse.GetIdentitiesTokenBalancesResponseV0
 */
export declare const GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0$Type;
declare class GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalanceEntry$Type extends MessageType<GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalanceEntry> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalanceEntry>): GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalanceEntry;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalanceEntry): GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalanceEntry;
    internalBinaryWrite(message: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalanceEntry, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesResponse.GetIdentitiesTokenBalancesResponseV0.IdentityTokenBalanceEntry
 */
export declare const GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalanceEntry: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalanceEntry$Type;
declare class GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances$Type extends MessageType<GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances> {
    constructor();
    create(value?: PartialMessage<GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances>): GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances): GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances;
    internalBinaryWrite(message: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetIdentitiesTokenBalancesResponse.GetIdentitiesTokenBalancesResponseV0.IdentityTokenBalances
 */
export declare const GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances: GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances$Type;
declare class GetTokenContractInfoRequest$Type extends MessageType<GetTokenContractInfoRequest> {
    constructor();
    create(value?: PartialMessage<GetTokenContractInfoRequest>): GetTokenContractInfoRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenContractInfoRequest): GetTokenContractInfoRequest;
    internalBinaryWrite(message: GetTokenContractInfoRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenContractInfoRequest
 */
export declare const GetTokenContractInfoRequest: GetTokenContractInfoRequest$Type;
declare class GetTokenContractInfoRequest_GetTokenContractInfoRequestV0$Type extends MessageType<GetTokenContractInfoRequest_GetTokenContractInfoRequestV0> {
    constructor();
    create(value?: PartialMessage<GetTokenContractInfoRequest_GetTokenContractInfoRequestV0>): GetTokenContractInfoRequest_GetTokenContractInfoRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenContractInfoRequest_GetTokenContractInfoRequestV0): GetTokenContractInfoRequest_GetTokenContractInfoRequestV0;
    internalBinaryWrite(message: GetTokenContractInfoRequest_GetTokenContractInfoRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenContractInfoRequest.GetTokenContractInfoRequestV0
 */
export declare const GetTokenContractInfoRequest_GetTokenContractInfoRequestV0: GetTokenContractInfoRequest_GetTokenContractInfoRequestV0$Type;
declare class GetTokenContractInfoResponse$Type extends MessageType<GetTokenContractInfoResponse> {
    constructor();
    create(value?: PartialMessage<GetTokenContractInfoResponse>): GetTokenContractInfoResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenContractInfoResponse): GetTokenContractInfoResponse;
    internalBinaryWrite(message: GetTokenContractInfoResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenContractInfoResponse
 */
export declare const GetTokenContractInfoResponse: GetTokenContractInfoResponse$Type;
declare class GetTokenContractInfoResponse_GetTokenContractInfoResponseV0$Type extends MessageType<GetTokenContractInfoResponse_GetTokenContractInfoResponseV0> {
    constructor();
    create(value?: PartialMessage<GetTokenContractInfoResponse_GetTokenContractInfoResponseV0>): GetTokenContractInfoResponse_GetTokenContractInfoResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenContractInfoResponse_GetTokenContractInfoResponseV0): GetTokenContractInfoResponse_GetTokenContractInfoResponseV0;
    internalBinaryWrite(message: GetTokenContractInfoResponse_GetTokenContractInfoResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenContractInfoResponse.GetTokenContractInfoResponseV0
 */
export declare const GetTokenContractInfoResponse_GetTokenContractInfoResponseV0: GetTokenContractInfoResponse_GetTokenContractInfoResponseV0$Type;
declare class GetTokenContractInfoResponse_GetTokenContractInfoResponseV0_TokenContractInfoData$Type extends MessageType<GetTokenContractInfoResponse_GetTokenContractInfoResponseV0_TokenContractInfoData> {
    constructor();
    create(value?: PartialMessage<GetTokenContractInfoResponse_GetTokenContractInfoResponseV0_TokenContractInfoData>): GetTokenContractInfoResponse_GetTokenContractInfoResponseV0_TokenContractInfoData;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenContractInfoResponse_GetTokenContractInfoResponseV0_TokenContractInfoData): GetTokenContractInfoResponse_GetTokenContractInfoResponseV0_TokenContractInfoData;
    internalBinaryWrite(message: GetTokenContractInfoResponse_GetTokenContractInfoResponseV0_TokenContractInfoData, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenContractInfoResponse.GetTokenContractInfoResponseV0.TokenContractInfoData
 */
export declare const GetTokenContractInfoResponse_GetTokenContractInfoResponseV0_TokenContractInfoData: GetTokenContractInfoResponse_GetTokenContractInfoResponseV0_TokenContractInfoData$Type;
declare class GetTokenDirectPurchasePricesRequest$Type extends MessageType<GetTokenDirectPurchasePricesRequest> {
    constructor();
    create(value?: PartialMessage<GetTokenDirectPurchasePricesRequest>): GetTokenDirectPurchasePricesRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenDirectPurchasePricesRequest): GetTokenDirectPurchasePricesRequest;
    internalBinaryWrite(message: GetTokenDirectPurchasePricesRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesRequest
 */
export declare const GetTokenDirectPurchasePricesRequest: GetTokenDirectPurchasePricesRequest$Type;
declare class GetTokenDirectPurchasePricesRequest_GetTokenDirectPurchasePricesRequestV0$Type extends MessageType<GetTokenDirectPurchasePricesRequest_GetTokenDirectPurchasePricesRequestV0> {
    constructor();
    create(value?: PartialMessage<GetTokenDirectPurchasePricesRequest_GetTokenDirectPurchasePricesRequestV0>): GetTokenDirectPurchasePricesRequest_GetTokenDirectPurchasePricesRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenDirectPurchasePricesRequest_GetTokenDirectPurchasePricesRequestV0): GetTokenDirectPurchasePricesRequest_GetTokenDirectPurchasePricesRequestV0;
    internalBinaryWrite(message: GetTokenDirectPurchasePricesRequest_GetTokenDirectPurchasePricesRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesRequest.GetTokenDirectPurchasePricesRequestV0
 */
export declare const GetTokenDirectPurchasePricesRequest_GetTokenDirectPurchasePricesRequestV0: GetTokenDirectPurchasePricesRequest_GetTokenDirectPurchasePricesRequestV0$Type;
declare class GetTokenDirectPurchasePricesResponse$Type extends MessageType<GetTokenDirectPurchasePricesResponse> {
    constructor();
    create(value?: PartialMessage<GetTokenDirectPurchasePricesResponse>): GetTokenDirectPurchasePricesResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenDirectPurchasePricesResponse): GetTokenDirectPurchasePricesResponse;
    internalBinaryWrite(message: GetTokenDirectPurchasePricesResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse
 */
export declare const GetTokenDirectPurchasePricesResponse: GetTokenDirectPurchasePricesResponse$Type;
declare class GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0$Type extends MessageType<GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0> {
    constructor();
    create(value?: PartialMessage<GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0>): GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0): GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0;
    internalBinaryWrite(message: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0
 */
export declare const GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0$Type;
declare class GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PriceForQuantity$Type extends MessageType<GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PriceForQuantity> {
    constructor();
    create(value?: PartialMessage<GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PriceForQuantity>): GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PriceForQuantity;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PriceForQuantity): GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PriceForQuantity;
    internalBinaryWrite(message: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PriceForQuantity, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.PriceForQuantity
 */
export declare const GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PriceForQuantity: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PriceForQuantity$Type;
declare class GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PricingSchedule$Type extends MessageType<GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PricingSchedule> {
    constructor();
    create(value?: PartialMessage<GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PricingSchedule>): GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PricingSchedule;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PricingSchedule): GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PricingSchedule;
    internalBinaryWrite(message: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PricingSchedule, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.PricingSchedule
 */
export declare const GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PricingSchedule: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_PricingSchedule$Type;
declare class GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePriceEntry$Type extends MessageType<GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePriceEntry> {
    constructor();
    create(value?: PartialMessage<GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePriceEntry>): GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePriceEntry;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePriceEntry): GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePriceEntry;
    internalBinaryWrite(message: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePriceEntry, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.TokenDirectPurchasePriceEntry
 */
export declare const GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePriceEntry: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePriceEntry$Type;
declare class GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePrices$Type extends MessageType<GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePrices> {
    constructor();
    create(value?: PartialMessage<GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePrices>): GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePrices;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePrices): GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePrices;
    internalBinaryWrite(message: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePrices, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenDirectPurchasePricesResponse.GetTokenDirectPurchasePricesResponseV0.TokenDirectPurchasePrices
 */
export declare const GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePrices: GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0_TokenDirectPurchasePrices$Type;
declare class GetTokenTotalSupplyRequest$Type extends MessageType<GetTokenTotalSupplyRequest> {
    constructor();
    create(value?: PartialMessage<GetTokenTotalSupplyRequest>): GetTokenTotalSupplyRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenTotalSupplyRequest): GetTokenTotalSupplyRequest;
    internalBinaryWrite(message: GetTokenTotalSupplyRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenTotalSupplyRequest
 */
export declare const GetTokenTotalSupplyRequest: GetTokenTotalSupplyRequest$Type;
declare class GetTokenTotalSupplyRequest_GetTokenTotalSupplyRequestV0$Type extends MessageType<GetTokenTotalSupplyRequest_GetTokenTotalSupplyRequestV0> {
    constructor();
    create(value?: PartialMessage<GetTokenTotalSupplyRequest_GetTokenTotalSupplyRequestV0>): GetTokenTotalSupplyRequest_GetTokenTotalSupplyRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenTotalSupplyRequest_GetTokenTotalSupplyRequestV0): GetTokenTotalSupplyRequest_GetTokenTotalSupplyRequestV0;
    internalBinaryWrite(message: GetTokenTotalSupplyRequest_GetTokenTotalSupplyRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenTotalSupplyRequest.GetTokenTotalSupplyRequestV0
 */
export declare const GetTokenTotalSupplyRequest_GetTokenTotalSupplyRequestV0: GetTokenTotalSupplyRequest_GetTokenTotalSupplyRequestV0$Type;
declare class GetTokenTotalSupplyResponse$Type extends MessageType<GetTokenTotalSupplyResponse> {
    constructor();
    create(value?: PartialMessage<GetTokenTotalSupplyResponse>): GetTokenTotalSupplyResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenTotalSupplyResponse): GetTokenTotalSupplyResponse;
    internalBinaryWrite(message: GetTokenTotalSupplyResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenTotalSupplyResponse
 */
export declare const GetTokenTotalSupplyResponse: GetTokenTotalSupplyResponse$Type;
declare class GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0$Type extends MessageType<GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0> {
    constructor();
    create(value?: PartialMessage<GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0>): GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0): GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0;
    internalBinaryWrite(message: GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenTotalSupplyResponse.GetTokenTotalSupplyResponseV0
 */
export declare const GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0: GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0$Type;
declare class GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0_TokenTotalSupplyEntry$Type extends MessageType<GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0_TokenTotalSupplyEntry> {
    constructor();
    create(value?: PartialMessage<GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0_TokenTotalSupplyEntry>): GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0_TokenTotalSupplyEntry;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0_TokenTotalSupplyEntry): GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0_TokenTotalSupplyEntry;
    internalBinaryWrite(message: GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0_TokenTotalSupplyEntry, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.GetTokenTotalSupplyResponse.GetTokenTotalSupplyResponseV0.TokenTotalSupplyEntry
 */
export declare const GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0_TokenTotalSupplyEntry: GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0_TokenTotalSupplyEntry$Type;
declare class StateId$Type extends MessageType<StateId> {
    constructor();
    create(value?: PartialMessage<StateId>): StateId;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StateId): StateId;
    internalBinaryWrite(message: StateId, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.StateId
 */
export declare const StateId: StateId$Type;
declare class CanonicalVote$Type extends MessageType<CanonicalVote> {
    constructor();
    create(value?: PartialMessage<CanonicalVote>): CanonicalVote;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CanonicalVote): CanonicalVote;
    internalBinaryWrite(message: CanonicalVote, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.CanonicalVote
 */
export declare const CanonicalVote: CanonicalVote$Type;
declare class WaitForStateTransitionResultRequest$Type extends MessageType<WaitForStateTransitionResultRequest> {
    constructor();
    create(value?: PartialMessage<WaitForStateTransitionResultRequest>): WaitForStateTransitionResultRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: WaitForStateTransitionResultRequest): WaitForStateTransitionResultRequest;
    internalBinaryWrite(message: WaitForStateTransitionResultRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.WaitForStateTransitionResultRequest
 */
export declare const WaitForStateTransitionResultRequest: WaitForStateTransitionResultRequest$Type;
declare class WaitForStateTransitionResultRequest_WaitForStateTransitionResultRequestV0$Type extends MessageType<WaitForStateTransitionResultRequest_WaitForStateTransitionResultRequestV0> {
    constructor();
    create(value?: PartialMessage<WaitForStateTransitionResultRequest_WaitForStateTransitionResultRequestV0>): WaitForStateTransitionResultRequest_WaitForStateTransitionResultRequestV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: WaitForStateTransitionResultRequest_WaitForStateTransitionResultRequestV0): WaitForStateTransitionResultRequest_WaitForStateTransitionResultRequestV0;
    internalBinaryWrite(message: WaitForStateTransitionResultRequest_WaitForStateTransitionResultRequestV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.WaitForStateTransitionResultRequest.WaitForStateTransitionResultRequestV0
 */
export declare const WaitForStateTransitionResultRequest_WaitForStateTransitionResultRequestV0: WaitForStateTransitionResultRequest_WaitForStateTransitionResultRequestV0$Type;
declare class WaitForStateTransitionResultResponse$Type extends MessageType<WaitForStateTransitionResultResponse> {
    constructor();
    create(value?: PartialMessage<WaitForStateTransitionResultResponse>): WaitForStateTransitionResultResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: WaitForStateTransitionResultResponse): WaitForStateTransitionResultResponse;
    internalBinaryWrite(message: WaitForStateTransitionResultResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.WaitForStateTransitionResultResponse
 */
export declare const WaitForStateTransitionResultResponse: WaitForStateTransitionResultResponse$Type;
declare class WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0$Type extends MessageType<WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0> {
    constructor();
    create(value?: PartialMessage<WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0>): WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0): WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0;
    internalBinaryWrite(message: WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message org.dash.platform.dapi.v0.WaitForStateTransitionResultResponse.WaitForStateTransitionResultResponseV0
 */
export declare const WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0: WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0$Type;
/**
 * @generated ServiceType for protobuf service org.dash.platform.dapi.v0.Platform
 */
export declare const Platform: ServiceType;
export {};
