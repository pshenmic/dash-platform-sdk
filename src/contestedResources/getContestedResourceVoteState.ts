import {
  ContestedResourceVoteState,
  ContestedStateResultType
} from '../types.js'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import {
  GetContestedResourceVoteStateRequest,
  GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_ResultType,
  GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo
} from '../../proto/generated/platform.js'
import { DataContractWASM, DocumentWASM, IdentifierWASM, PlatformVersionWASM, verifyVotePollVoteStateProof } from 'pshenmic-dpp'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

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

  const { response } = await grpcPool.getClient().getContestedResourceVoteState(getContestedResourceVoteStateRequest)

  const { version } = response

  if (version.oneofKind !== 'v0') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
  }

  const { v0 } = version

  if (v0.result.oneofKind !== 'proof') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be proof)')
  }

  const { result: { proof }, metadata } = v0

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    rootHash,
    result
  } = verifyVotePollVoteStateProof(
    proof.grovedbProof,
    contract,
    documentTypeName,
    indexName,
    indexValues,
    resultType,
    allowIncludeLockedAndAbstainingVoteTally,
    count,
    startAtIdentifierInfo,
    LATEST_PLATFORM_VERSION
  )

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

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
      identifier: contender.identityId,
      document: contender.serializedDocument != null ? DocumentWASM.fromBytes(contender.serializedDocument, contract, documentTypeName, PlatformVersionWASM.PLATFORM_V9) : undefined,
      voteTally: contender.voteTally
    })),
    abstainVoteTally: result?.abstainingVoteTally ?? 0,
    lockVoteTally: result?.lockedVoteTally ?? 0,
    skipped: result?.skipped === 1,
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
