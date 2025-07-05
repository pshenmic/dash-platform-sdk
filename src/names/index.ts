import search from './search'
import GRPCConnectionPool from '../grpcConnectionPool'
import { DocumentWASM } from 'pshenmic-dpp'

export class NamesController {
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  async search (name: string): Promise<DocumentWASM[]> {
    return await search(this.grpcPool, name)
  }
}
