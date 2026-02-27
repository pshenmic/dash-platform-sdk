import getContestedResourceVoteState from './getContestedResourceVoteState.js';
/**
 * Contested Resources controller for requesting information about contested resources
 *
 * @hideconstructor
 */
export class ContestedResourcesController {
    /** @ignore **/
    grpcPool;
    constructor(grpcPool) {
        this.grpcPool = grpcPool;
    }
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
    async getContestedResourceVoteState(contract, documentTypeName, indexName, indexValuesBytes, resultType, allowIncludeLockedAndAbstainingVoteTally, startAtIdentifierInfo, count) {
        return await getContestedResourceVoteState(this.grpcPool, contract, documentTypeName, indexName, indexValuesBytes, resultType, allowIncludeLockedAndAbstainingVoteTally, startAtIdentifierInfo, count);
    }
}
