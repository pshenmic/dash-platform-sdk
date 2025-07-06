import getStatus from './status'
import GRPCConnectionPool from '../grpcConnectionPool'
import { NodeStatus } from '../types'

export class NodeController {
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  async status (): Promise<NodeStatus> {
    return await getStatus(this.grpcPool)
  }
}
