import GRPCConnectionPool from '../grpcConnectionPool'
import { ContestedResourceVoteState, ContestedStateResultType } from '../types'
import getContestedResourceVoteState, { StartAtIdentifierInfo } from './getContestedResourceVoteState'
import stringToIndexValueBytes from '../utils/stringToIndexValueBytes'
import { DataContractWASM } from 'pshenmic-dpp'

export default class ContestedStateController {
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  async getContestedResourceVoteState (
    contract: DataContractWASM,
    documentTypeName: string,
    indexName: string,
    indexValues: string[] | Array<Uint8Array<ArrayBufferLike>>,
    resultType: ContestedStateResultType,
    allowIncludeLockedAndAbstainingVoteTally: boolean,
    startAtIdentifierInfo?: StartAtIdentifierInfo,
    count?: number
  ): Promise<ContestedResourceVoteState> {
    const indexValuesBytes =
      indexValues.every(value => typeof value === 'string')
        ? indexValues.map(stringToIndexValueBytes)
        : indexValues

    return await getContestedResourceVoteState(this.grpcPool, contract, documentTypeName, indexName, indexValuesBytes, resultType, allowIncludeLockedAndAbstainingVoteTally, startAtIdentifierInfo, count)
  }
}
