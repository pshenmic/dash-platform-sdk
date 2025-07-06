import GRPCConnectionPool from "../grpcConnectionPool";
import {ContestedResourceVoteStateContenders, IdentifierLike} from "../types";
import getContestedResourceVoteState, {ResultType, StartAtIdentifierInfo} from "./getContestedResourceVoteState";

export default class ContestedStateController {
  grpcPool: GRPCConnectionPool

  constructor(grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool;
  }

  getContestedResourceVoteState(
    contractId: IdentifierLike,
    documentTypeName: string,
    indexName: string,
    indexValues: Uint8Array<ArrayBufferLike>[],
    resultType: ResultType,
    allowIncludeLockedAndAbstainingVoteTally?: boolean,
    startAtIdentifierInfo?: StartAtIdentifierInfo,
    count?: number,
  ): Promise<ContestedResourceVoteStateContenders> {
    return getContestedResourceVoteState(this.grpcPool, contractId, documentTypeName, indexName, indexValues, resultType, allowIncludeLockedAndAbstainingVoteTally, startAtIdentifierInfo, count);
  }
}