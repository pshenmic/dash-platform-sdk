import GRPCConnectionPool from '../grpcConnectionPool.js';
import { ContestedResourceVoteState, ContestedStateResultType } from '../../types.js';
import { DataContractWASM } from 'pshenmic-dpp';
import { StartAtIdentifierInfo } from './getContestedResourceVoteState.js';
/**
 * Contested Resources controller for requesting information about contested resources
 *
 * @hideconstructor
 */
export declare class ContestedResourcesController {
    /** @ignore **/
    grpcPool: GRPCConnectionPool;
    constructor(grpcPool: GRPCConnectionPool);
    /**
     * Retrieves an info about vote state for contested resource
     *
     * @param contract {DataContractWASM} - instance of contract with contested resource
     * @param documentTypeName {string} - document type name of contested resource
     * @param indexName {string} - index name of contested resource
     * @param indexValuesBytes {Uint8Array[]} - Array of contested values in bytes
     * @param resultType {ContestedResourceVoteState} - enum for result info
     * @param allowIncludeLockedAndAbstainingVoteTally {boolean}
     * @param startAtIdentifierInfo {StartAtIdentifierInfo=}
     * @param count {number=}
     *
     * @return {Promise<ContestedResourceVoteState>}
     */
    getContestedResourceVoteState(contract: DataContractWASM, documentTypeName: string, indexName: string, indexValuesBytes: Uint8Array[], resultType: ContestedStateResultType, allowIncludeLockedAndAbstainingVoteTally: boolean, startAtIdentifierInfo?: StartAtIdentifierInfo, count?: number): Promise<ContestedResourceVoteState>;
}
