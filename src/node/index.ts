import getStatus from './status.js'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import { NodeStatus } from '../../types.js'
import getEpochsInfo, { EpochInfo } from './epochs.js'
import getTotalCredits from './totalCredits.js'

/**
 * Node controller for requesting information about DAPI node
 *
 * @hideconstructor
 */
export class NodeController {
  /** @ignore **/
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
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
}
