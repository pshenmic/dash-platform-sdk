import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { GetFinalizedEpochInfosRequest } from '../../proto/generated/platform.js'
import { IdentifierWASM, verifyFinalizedEpochInfosProof } from 'pshenmic-dpp'
import QueryExecutor from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export interface FinalizedEpochInfo {
  epochIndex: number
  firstBlockTime: Date
  firstBlockHeight: bigint
  totalBlocksInEpoch: bigint
  firstCoreBlockHeight: number
  nextEpochStartCoreBlockHeight: number
  totalProcessingFees: bigint
  totalDistributedStorageFees: bigint
  totalCreatedStorageFees: bigint
  coreBlockRewards: bigint
  blockProposers: Array<{
    proposer: IdentifierWASM
    count: bigint
  }>
  feeMultiplier: bigint
  protocolVersion: number
}

export default async function getFinalizedEpochsInfo (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, startEpochIndex: number, startEpochIndexIncluded: boolean, endEpochIndex: number, endEpochIndexIncluded: boolean): Promise<FinalizedEpochInfo[]> {
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

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getFinalizedEpochInfos', getEpochsInfoRequest)
    .setProofVerifier(verifyFinalizedEpochInfosProof, startEpochIndex, startEpochIndexIncluded, endEpochIndex, endEpochIndexIncluded, LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      if (data.proved) {
        return data.verified.epochInfos.map(info => ({
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

      return data.result.epochs.finalizedEpochInfos.map(info => ({
        epochIndex: info.number,
        firstBlockTime: new Date(Number(info.firstBlockTime)),
        firstBlockHeight: BigInt(info.firstBlockHeight),
        totalBlocksInEpoch: BigInt(info.totalBlocksInEpoch),
        firstCoreBlockHeight: info.firstCoreBlockHeight,
        nextEpochStartCoreBlockHeight: info.nextEpochStartCoreBlockHeight,
        totalProcessingFees: BigInt(info.totalProcessingFees),
        totalDistributedStorageFees: BigInt(info.totalDistributedStorageFees),
        totalCreatedStorageFees: BigInt(info.totalCreatedStorageFees),
        coreBlockRewards: BigInt(info.coreBlockRewards),
        blockProposers: info.blockProposers.map(({ proposerId, blockCount }) => ({
          proposer: new IdentifierWASM(proposerId),
          count: BigInt(blockCount)
        })),
        // returned as a fraction, e.g. 1.5 for 1500 permille
        feeMultiplier: BigInt(Math.round(info.feeMultiplier * 1000)),
        protocolVersion: info.protocolVersion
      })) as unknown as FinalizedEpochInfo[]
    })
    .execute()
}
