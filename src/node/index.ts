import getStatus from './status.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { NodeStatus } from '../../types.js'
import getEpochsInfo, { EpochInfo } from './epochInfos.js'
import getFinalizedEpochsInfo, { FinalizedEpochInfo } from './finalizedEpochInfos.js'
import getTotalCredits from './totalCredits.js'
import getCurrentQuorumsInfo, { CurrentQuorumsInfo } from './getCurrentQuorumsInfo.js'
import getProtocolVersion from './getProtocolVersion.js'
import { PlatformVersionWASM } from 'pshenmic-dpp'

/**
 * Node controller for requesting information about DAPI node
 *
 * @hideconstructor
 */
export class NodeController {
  /** @ignore **/
  grpcPool: GRPCPool
  /** @ignore **/
  quorumKeyProvider: QuorumKeyProvider

  constructor (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider) {
    this.grpcPool = grpcPool
    this.quorumKeyProvider = quorumKeyProvider
  }

  /**
   * Retrieves an info about node
   * Includes information about genesis, chain, software versions
   *
   * @return {Promise<NodeStatus>}
   */
  async status (): Promise<NodeStatus> {
    return await getStatus(this.grpcPool)
  }

  /**
   * Returns total credits amount in platform
   *
   * @return {Promise<bigint>}
   */
  async totalCredits (): Promise<bigint> {
    return await getTotalCredits(this.grpcPool, this.quorumKeyProvider)
  }

  /**
   * Returns the protocol version of the network, used by default to verify proofs and to create documents.
   * It is learned from the verified responses, if no response was verified yet, one proved request is made
   * (even if proofs are disabled)
   *
   * @return {Promise<PlatformVersionWASM>}
   */
  async getProtocolVersion (): Promise<PlatformVersionWASM> {
    return await getProtocolVersion(this.grpcPool, this.quorumKeyProvider)
  }

  /**
   * Retrieves an info about epochs
   * Includes information about first block height, time, fee multiplier, number
   *
   * @return {Promise<EpochInfo[]>}
   */
  async getEpochsInfo (count: number, ascending: boolean, start?: number): Promise<EpochInfo[]> {
    return await getEpochsInfo(this.grpcPool, this.quorumKeyProvider, count, ascending, start)
  }

  /**
   * Retrieves an finalized info about epochs
   * Includes information about first block height, time, fee multiplier, number
   *
   * @return {Promise<FinalizedEpochInfo[]>}
   */
  async getFinalizedEpochsInfo (startEpochIndex: number, startEpochIndexIncluded: boolean, endEpochIndex: number, endEpochIndexIncluded: boolean): Promise<FinalizedEpochInfo[]> {
    return await getFinalizedEpochsInfo(this.grpcPool, this.quorumKeyProvider, startEpochIndex, startEpochIndexIncluded, endEpochIndex, endEpochIndexIncluded)
  }

  /**
   * Retrieves an info about current validator sets (quorums)
   * Includes quorum hashes, members of validator sets with their IPs and last block proposer
   *
   * @return {Promise<CurrentQuorumsInfo>}
   */
  async getCurrentQuorumsInfo (): Promise<CurrentQuorumsInfo> {
    return await getCurrentQuorumsInfo(this.grpcPool)
  }
}
