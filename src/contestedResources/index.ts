import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { ContestedResourceVoteState, ContestedStateResultType } from '../../types.js'
import { DataContractWASM, VotePollsAtEndDate, VotePollsByEndDateTimeBound } from 'pshenmic-dpp'
import getContestedResourceVoteState, { StartAtIdentifierInfo } from './getContestedResourceVoteState.js'
import getVotePollsByEndDate from './getVotePollsByEndDate.js'

/**
 * Contested Resources controller for requesting information about contested resources
 *
 * @hideconstructor
 */
export class ContestedResourcesController {
  /** @ignore **/
  grpcPool: GRPCPool
  /** @ignore **/
  quorumKeyProvider: QuorumKeyProvider

  constructor (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider) {
    this.grpcPool = grpcPool
    this.quorumKeyProvider = quorumKeyProvider
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
  async getContestedResourceVoteState (
    contract: DataContractWASM,
    documentTypeName: string,
    indexName: string,
    indexValuesBytes: Uint8Array[],
    resultType: ContestedStateResultType,
    allowIncludeLockedAndAbstainingVoteTally: boolean,
    startAtIdentifierInfo?: StartAtIdentifierInfo,
    count?: number
  ): Promise<ContestedResourceVoteState> {
    return await getContestedResourceVoteState(this.grpcPool, this.quorumKeyProvider, contract, documentTypeName, indexName, indexValuesBytes, resultType, allowIncludeLockedAndAbstainingVoteTally, startAtIdentifierInfo, count)
  }

  /**
   * Retrieves vote polls grouped by their end time
   *
   * @param startTime {VotePollsByEndDateTimeBound=} - lower bound of the end time in milliseconds
   * @param endTime {VotePollsByEndDateTimeBound=} - upper bound of the end time in milliseconds
   * @param limit {number=}
   * @param ascending {boolean=} - order by end time, ascending by default
   *
   * @return {Promise<VotePollsAtEndDate[]>}
   */
  async getVotePollsByEndDate (
    startTime?: VotePollsByEndDateTimeBound,
    endTime?: VotePollsByEndDateTimeBound,
    limit?: number,
    ascending: boolean = true
  ): Promise<VotePollsAtEndDate[]> {
    return await getVotePollsByEndDate(this.grpcPool, this.quorumKeyProvider, startTime, endTime, limit, ascending)
  }
}
