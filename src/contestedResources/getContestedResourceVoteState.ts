import {
  ContestedResourceVoteState,
  ContestedStateResultType
} from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'
import {
  GetContestedResourceVoteStateRequest,
  GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_ResultType,
  GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo,
  GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0
} from '../../proto/generated/platform'
import { DataContractWASM, DocumentWASM, IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { verifyVotePollVoteStateProof } from 'wasm-drive-verify'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'

export type StartAtIdentifierInfo = GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo

export default async function getContestedResourceVoteState (
  grpcPool: GRPCConnectionPool,
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

  const getContestedResourceVoteStateRequest = GetContestedResourceVoteStateRequest.fromPartial({
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
  })

  const { v0 } = await grpcPool.getClient().getContestedResourceVoteState(getContestedResourceVoteStateRequest)

  const { proof, metadata } = v0 as GetContestedResourceVoteStateResponse_GetContestedResourceVoteStateResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    result
  } = verifyVotePollVoteStateProof(
    proof.grovedbProof,
    contract.bytes(PlatformVersionWASM.PLATFORM_V9),
    documentTypeName,
    indexName,
    indexValues,
    resultType,
    allowIncludeLockedAndAbstainingVoteTally,
    count,
    startAtIdentifierInfo,
    PlatformVersionWASM.PLATFORM_V9
  )

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  const { contenders } = result ?? { contenders: [] }
  const { winner } = result ?? { winner: undefined }

  if (contenders.length === 0) {
    throw new Error('Vote state not found')
  }

  return {
    contenders: contenders.map(contender => ({
      ...contender,
      identifier: new IdentifierWASM(contender.identifier),
      document: contender.document != null ? DocumentWASM.fromBytes(contender.document, contract, documentTypeName, PlatformVersionWASM.PLATFORM_V9) : undefined
    })),
    abstainVoteTally: result?.abstainVoteTally ?? 0,
    lockVoteTally: result?.lockVoteTally ?? 0,
    finishedVoteInfo: (winner != null)
      ? {
          type: winner.type,
          wonByIdentityId: winner.identityId != null ? new IdentifierWASM(winner.identityId) : undefined,
          finishedAtBlockHeight: winner.blockInfo.height,
          finishedAtCoreBlockHeight: winner.blockInfo.coreHeight,
          finishedAtBlockTimeMs: winner.blockInfo.timeMs,
          finishedAtEpoch: winner.blockInfo.epoch
        }
      : undefined
  }
}
