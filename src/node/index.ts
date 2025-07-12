import getStatus from './status'
import GRPCConnectionPool from '../grpcConnectionPool'
import { NodeStatus } from '../types'
import getEpochsInfo, { EpochInfo } from './epochs'
import getTotalCredits from './totalCredits'

export class NodeController {
  grpcPool: GRPCConnectionPool
  network: 'testnet' | 'mainnet'

  constructor (grpcPool: GRPCConnectionPool, network: 'testnet' | 'mainnet') {
    this.grpcPool = grpcPool
    this.network = network
  }

  async status (): Promise<NodeStatus> {
    return await getStatus(this.grpcPool)
  }

  async totalCredits (): Promise<bigint> {
    return await getTotalCredits(this.grpcPool, this.network)
  }

  async getEpochsInfo (count: number, ascending: boolean, start?: number): Promise<EpochInfo[]> {
    return await getEpochsInfo(this.grpcPool, count, ascending, start)
  }
}
