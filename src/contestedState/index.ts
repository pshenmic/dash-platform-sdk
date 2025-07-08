import GRPCConnectionPool from "../grpcConnectionPool";
import {ContestedResourceVoteState, ContestedStateResultType, IdentifierLike} from "../types";
import getContestedResourceVoteState, {StartAtIdentifierInfo} from "./getContestedResourceVoteState";
import stringToIndexValueBytes from "../utils/stringToIndexValueBytes";

export default class ContestedStateController {
  grpcPool: GRPCConnectionPool

  constructor(grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool;
  }

  getContestedResourceVoteState(
    contractId: IdentifierLike,
    documentTypeName: string,
    indexName: string,
    indexValues: string[] | Uint8Array<ArrayBufferLike>[],
    resultType: ContestedStateResultType,
    allowIncludeLockedAndAbstainingVoteTally?: boolean,
    startAtIdentifierInfo?: StartAtIdentifierInfo,
    count?: number,
  ): Promise<ContestedResourceVoteState> {
    const indexValuesBytes =
      indexValues.every(value => typeof value === 'string')
        ? indexValues.map(stringToIndexValueBytes)
        : indexValues as Uint8Array<ArrayBufferLike>[]

    return getContestedResourceVoteState(this.grpcPool, contractId, documentTypeName, indexName, indexValuesBytes, resultType, allowIncludeLockedAndAbstainingVoteTally, startAtIdentifierInfo, count);
  }
}