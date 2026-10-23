import {
  ContestedResourceVoteState,
  ContestedStateResultType
} from '../../types.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import {
  GetContestedResourceVoteStateRequest,
  GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_ResultType,
  GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo
} from '../../proto/generated/platform.js'
import { DataContractWASM, DocumentWASM, IdentifierWASM, verifyVotePollVoteStateProof } from 'pshenmic-dpp'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export type StartAtIdentifierInfo = GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo

export default async function getContestedResourceVoteState (
  grpcPool: GRPCPool,
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

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getContestedResourceVoteState', getContestedResourceVoteStateRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        result: voteState
      } = verifyGroveDBProof(
        verifyVotePollVoteStateProof,
        proof.grovedbProof,
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

      const { contenders } = voteState ?? { contenders: [] }
      const { winner } = voteState ?? { winner: undefined }

      if (contenders.length === 0) {
        throw new Error('Vote state not found')
      }

      const result = {
        contenders: contenders.map(contender => ({
          identifier: contender.identityId,
          document: contender.serializedDocument != null ? DocumentWASM.fromBytes(contender.serializedDocument, contract, documentTypeName, LATEST_PLATFORM_VERSION) : undefined,
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

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
