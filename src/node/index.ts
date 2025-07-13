import getStatus from './status'
import GRPCConnectionPool from '../grpcConnectionPool'
import { NodeStatus } from '../types'
import getEpochsInfo, { EpochInfo } from './epochs'
import getTotalCredits from './totalCredits'

/**
 * Node controller for requesting information about DAPI node
 *
 * @hideconstructor
 */
export class NodeController {
  /** @ignore **/
  grpcPool: GRPCConnectionPool
  network: 'testnet' | 'mainnet'

  constructor (grpcPool: GRPCConnectionPool, network: 'testnet' | 'mainnet') {
    this.grpcPool = grpcPool
    this.network = network
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
    return await getTotalCredits(this.grpcPool, this.network)
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
