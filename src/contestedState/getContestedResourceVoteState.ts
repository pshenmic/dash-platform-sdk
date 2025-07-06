import {ContestedResourceVoteStateContenders, FinishedVoteOutcome, IdentifierLike} from "../types";
import GRPCConnectionPool from "../grpcConnectionPool";
import {
  GetContestedResourceVoteStateRequest,
  GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_ResultType,
  GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo,
  GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0,
  GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_ContestedResourceContenders
} from "../../proto/generated/platform";
import {IdentifierWASM} from "pshenmic-dpp";

export type ResultType = GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_ResultType;

export type StartAtIdentifierInfo = GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo;

export default async function getContestedResourceVoteState(
  grpcPool: GRPCConnectionPool,
  contractId: IdentifierLike,
  documentTypeName: string,
  indexName: string,
  indexValues: Uint8Array<ArrayBufferLike>[],
  resultType: ResultType,
  allowIncludeLockedAndAbstainingVoteTally?: boolean,
  startAtIdentifierInfo?: StartAtIdentifierInfo,
  count?: number,
): Promise<ContestedResourceVoteStateContenders> {
  if(startAtIdentifierInfo != null) {
    startAtIdentifierInfo = {
      startIdentifier: (new IdentifierWASM(startAtIdentifierInfo.startIdentifier)).bytes(),
      startIdentifierIncluded: startAtIdentifierInfo.startIdentifierIncluded,
    }
  }

  const getContestedResourceVoteStateRequest = GetContestedResourceVoteStateRequest.fromPartial({
    v0: {
      contractId: (new IdentifierWASM(contractId)).bytes(),
      documentTypeName,
      indexName,
      indexValues,
      resultType: resultType,
      allowIncludeLockedAndAbstainingVoteTally,
      startAtIdentifierInfo,
      count
    }
  })

  const {v0} = await grpcPool.getClient().getContestedResourceVoteState(getContestedResourceVoteStateRequest);

  const { contestedResourceContenders } = v0 as GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0

  const { contenders } = contestedResourceContenders ?? {contenders: []}
  const { finishedVoteInfo } = contestedResourceContenders ?? {finishedVoteInfo: undefined};


  return {
    contenders: contenders.map(contender => ({...contender, identifier: new IdentifierWASM(contender.identifier)})),
    abstainVoteTally: contestedResourceContenders?.abstainVoteTally,
    lockVoteTally: contestedResourceContenders?.lockVoteTally,
    finishedVoteInfo: finishedVoteInfo ? {
      ...finishedVoteInfo,
      finishedVoteOutcome: finishedVoteInfo.finishedVoteOutcome ? finishedVoteInfo.finishedVoteOutcome as number as FinishedVoteOutcome : undefined,
      wonByIdentityId: finishedVoteInfo.wonByIdentityId ? (new IdentifierWASM(finishedVoteInfo.wonByIdentityId)) : undefined,
    } : undefined,
  };
}