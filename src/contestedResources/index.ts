import GRPCConnectionPool from '../grpcConnectionPool'
import { ContestedResourceVoteState, ContestedStateResultType } from '../types'
import getContestedResourceVoteState, { StartAtIdentifierInfo } from './getContestedResourceVoteState'
import { DataContractWASM } from 'pshenmic-dpp'

export default class ContestedResourcesController {
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

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
    return await getContestedResourceVoteState(this.grpcPool, contract, documentTypeName, indexName, indexValuesBytes, resultType, allowIncludeLockedAndAbstainingVoteTally, startAtIdentifierInfo, count)
  }
}
