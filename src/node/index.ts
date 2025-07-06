import getStatus from './status'
import GRPCConnectionPool from '../grpcConnectionPool'
import { NodeStatus } from '../types'
import getEpochsInfo, {EpochInfo} from "./epochs";
import getTotalCredits from './totalCredits'

export class NodeController {
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  async status (): Promise<NodeStatus> {
    return await getStatus(this.grpcPool)
  }

  async totalCredits(): Promise<bigint> {
    return await getTotalCredits(this.grpcPool)
  }

  async getEpochsInfo (count: number, start?: number, ascending?: boolean): Promise<EpochInfo[]> {
    return await getEpochsInfo(this.grpcPool, count, start, ascending)
  }
}
