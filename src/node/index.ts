import getStatus from './status.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import { NodeStatus } from '../../types.js'
import getEpochsInfo, { EpochInfo } from './epochInfos.js'
import getFinalizedEpochsInfo, {FinalizedEpochInfo} from './finalizedEpochInfos.js'
import getTotalCredits from './totalCredits.js'
import getCurrentQuorumsInfo, { CurrentQuorumsInfo } from './getCurrentQuorumsInfo.js'

/**
 * Node controller for requesting information about DAPI node
 *
 * @hideconstructor
 */
export class NodeController {
  /** @ignore **/
  grpcPool: GRPCPool

  constructor (grpcPool: GRPCPool) {
    this.grpcPool = grpcPool
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
    return await getTotalCredits(this.grpcPool)
  }

  /**
   * Retrieves an info about epochs
   * Includes information about first block height, time, fee multiplier, number
   *
   * @return {Promise<EpochInfo[]>}
   */
  async getEpochsInfo (count: number, ascending: boolean, start?: number): Promise<EpochInfo[]> {
    return await getEpochsInfo(this.grpcPool, count, ascending, start)
  }

  /**
   * Retrieves an finalized info about epochs
   * Includes information about first block height, time, fee multiplier, number
   *
   * @return {Promise<FinalizedEpochInfo[]>}
   */
  async getFinalizedEpochsInfo (startEpochIndex: number, startEpochIndexIncluded: boolean, endEpochIndex: number, endEpochIndexIncluded: boolean): Promise<FinalizedEpochInfo[]> {
    return await getFinalizedEpochsInfo(this.grpcPool, startEpochIndex, startEpochIndexIncluded, endEpochIndex, endEpochIndexIncluded)
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
