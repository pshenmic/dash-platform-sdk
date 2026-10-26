import {
  ContestedResourceVoteState,
  ContestedStateResultType
} from '../../types.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import {
  GetContestedResourceVoteStateRequest,
  GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_ResultType,
  GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo,
  GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0_FinishedVoteInfo_FinishedVoteOutcome as FinishedVoteOutcome
} from '../../proto/generated/platform.js'
import { DataContractWASM, DocumentWASM, IdentifierWASM, verifyVotePollVoteStateProof } from 'pshenmic-dpp'
import QueryExecutor from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

// winner types of the proof verification by finished vote outcome of the response
const FINISHED_VOTE_OUTCOMES: Record<FinishedVoteOutcome, string> = {
  [FinishedVoteOutcome.TOWARDS_IDENTITY]: 'WonByIdentity',
  [FinishedVoteOutcome.LOCKED]: 'Locked',
  [FinishedVoteOutcome.NO_PREVIOUS_WINNER]: 'NoWinner'
}

export type StartAtIdentifierInfo = GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo

export default async function getContestedResourceVoteState (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  contract: DataContractWASM,
  documentTypeName: string,
  indexName: string,
  indexValues: Array<Uint8Array<ArrayBufferLike>>,
  resultType: ContestedStateResultType,
  allowIncludeLockedAndAbstainingVoteTally: boolean,
  startAtIdentifierInfo?: StartAtIdentifierInfo,
  count?: number
): Promise<ContestedResourceVoteState> {
  if (startAtIdentifierInfo != null) {
    startAtIdentifierInfo = {
      startIdentifier: (new IdentifierWASM(startAtIdentifierInfo.startIdentifier)).bytes(),
      startIdentifierIncluded: startAtIdentifierInfo.startIdentifierIncluded
    }
  }

  const getContestedResourceVoteStateRequest = GetContestedResourceVoteStateRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        contractId: contract.id.bytes(),
        documentTypeName,
        indexName,
        indexValues,
        resultType: resultType as number as GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_ResultType,
        allowIncludeLockedAndAbstainingVoteTally,
        startAtIdentifierInfo,
        count,
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getContestedResourceVoteState', getContestedResourceVoteStateRequest)
    .setProofVerifier(
      verifyVotePollVoteStateProof,
      contract,
      documentTypeName,
      indexName,
      indexValues,
      // same enums
      // @ts-expect-error
      resultType,
      allowIncludeLockedAndAbstainingVoteTally,
      count,
      startAtIdentifierInfo,
      LATEST_PLATFORM_VERSION
    )
    .mapResponse(data => {
      const toDocument = (bytes?: Uint8Array): DocumentWASM | undefined => bytes != null ? DocumentWASM.fromBytes(bytes, contract, documentTypeName, LATEST_PLATFORM_VERSION) : undefined

      if (data.proved) {
        const { result: voteState } = data.verified
        const { contenders } = voteState ?? { contenders: [] }
        const { winner } = voteState ?? { winner: undefined }

        if (contenders.length === 0) {
          throw new Error('Vote state not found')
        }

        return {
          contenders: contenders.map(contender => ({
            identifier: contender.identityId,
            document: toDocument(contender.serializedDocument),
            voteTally: contender.voteTally
          })),
          abstainVoteTally: voteState?.abstainingVoteTally ?? 0,
          lockVoteTally: voteState?.lockedVoteTally ?? 0,
          skipped: voteState?.skipped === 1,
          finishedVoteInfo: (winner != null)
            ? {
                type: winner.type,
                wonByIdentityId: 'identityId' in winner && winner.identityId != null ? new IdentifierWASM(winner.identityId) : undefined,
                finishedAtBlockHeight: winner.blockInfo.height,
                finishedAtCoreBlockHeight: winner.blockInfo.coreHeight,
                finishedAtBlockTimeMs: winner.blockInfo.timeMs,
                finishedAtEpoch: winner.blockInfo.epoch
              }
            : undefined
        }
      }

      const { contenders, abstainVoteTally, lockVoteTally, finishedVoteInfo } = data.result.contestedResourceContenders

      if (contenders.length === 0) {
        throw new Error('Vote state not found')
      }

      return {
        contenders: contenders.map(contender => ({
          identifier: new IdentifierWASM(contender.identifier),
          document: toDocument(contender.document),
          voteTally: contender.voteCount
        })),
        abstainVoteTally: abstainVoteTally ?? 0,
        lockVoteTally: lockVoteTally ?? 0,
        // the number of skipped items is returned only with proof
        skipped: false,
        finishedVoteInfo: (finishedVoteInfo != null)
          ? {
              type: FINISHED_VOTE_OUTCOMES[finishedVoteInfo.finishedVoteOutcome],
              wonByIdentityId: finishedVoteInfo.wonByIdentityId != null ? new IdentifierWASM(finishedVoteInfo.wonByIdentityId) : undefined,
              finishedAtBlockHeight: BigInt(finishedVoteInfo.finishedAtBlockHeight),
              finishedAtCoreBlockHeight: finishedVoteInfo.finishedAtCoreBlockHeight,
              finishedAtBlockTimeMs: BigInt(finishedVoteInfo.finishedAtBlockTimeMs),
              finishedAtEpoch: finishedVoteInfo.finishedAtEpoch
            }
          : undefined
      }
    })
    .execute()
}
