import GRPCConnectionPool from '../grpcConnectionPool.js'
import {GetFinalizedEpochInfosRequest} from '../../proto/generated/platform.js'
import {IdentifierWASM, verifyFinalizedEpochInfosProof} from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export interface FinalizedEpochInfo {
  epochIndex: number,
  firstBlockTime: Date,
  firstBlockHeight: bigint,
  totalBlocksInEpoch: bigint,
  firstCoreBlockHeight: number,
  nextEpochStartCoreBlockHeight: number,
  totalProcessingFees: bigint,
  totalDistributedStorageFees: bigint,
  totalCreatedStorageFees: bigint,
  coreBlockRewards: bigint,
  blockProposers: {
    proposer: IdentifierWASM;
    count: bigint;
  }[],
  feeMultiplier: bigint,
  protocolVersion: number
}

export default async function getFinalizedEpochsInfo (grpcPool: GRPCConnectionPool, startEpochIndex: number, startEpochIndexIncluded: boolean, endEpochIndex: number, endEpochIndexIncluded: boolean): Promise<FinalizedEpochInfo[]> {
  const getEpochsInfoRequest = GetFinalizedEpochInfosRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        startEpochIndex,
        startEpochIndexIncluded,
        endEpochIndex,
        endEpochIndexIncluded,
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getFinalizedEpochInfos(getEpochsInfoRequest)

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
    epochInfos
  } = verifyFinalizedEpochInfosProof(
    proof.grovedbProof,
    startEpochIndex,
    startEpochIndexIncluded,
    endEpochIndex,
    endEpochIndexIncluded,
    LATEST_PLATFORM_VERSION
  )
  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return epochInfos.map(info => ({
    epochIndex: info.epochIndex,
    firstBlockTime: info.firstBlockTime,
    firstBlockHeight: info.firstBlockHeight,
    totalBlocksInEpoch: info.totalBlocksInEpoch,
    firstCoreBlockHeight: info.firstCoreBlockHeight,
    nextEpochStartCoreBlockHeight: info.nextEpochStartCoreBlockHeight,
    totalProcessingFees: info.totalProcessingFees,
    totalDistributedStorageFees: info.totalDistributedStorageFees,
    totalCreatedStorageFees: info.totalCreatedStorageFees,
    coreBlockRewards: info.coreBlockRewards,
    blockProposers: info.blockProposers,
    feeMultiplier: info.feeMultiplierPermille,
    protocolVersion: info.protocolVersion
  })) as unknown as FinalizedEpochInfo[]
}
