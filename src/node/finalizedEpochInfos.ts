import { GRPCPool } from '../grpcConnectionPool.js'
import {GetFinalizedEpochInfosRequest} from '../../proto/generated/platform.js'
import {IdentifierWASM, verifyFinalizedEpochInfosProof} from 'pshenmic-dpp'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../utils/QueryExecutor.js'
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

export default async function getFinalizedEpochsInfo (grpcPool: GRPCPool, startEpochIndex: number, startEpochIndexIncluded: boolean, endEpochIndex: number, endEpochIndexIncluded: boolean): Promise<FinalizedEpochInfo[]> {
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

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest(client => client.getFinalizedEpochInfos(getEpochsInfoRequest))
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        epochInfos
      } = verifyGroveDBProof(
        verifyFinalizedEpochInfosProof,
        proof.grovedbProof,
        startEpochIndex,
        startEpochIndexIncluded,
        endEpochIndex,
        endEpochIndexIncluded,
        LATEST_PLATFORM_VERSION
      )

      const result = epochInfos.map(info => ({
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

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
