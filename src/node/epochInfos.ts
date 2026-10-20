import { GRPCPool } from '../grpcConnectionPool.js'
import { GetEpochsInfoRequest } from '../../proto/generated/platform.js'
import { verifyEpochsInfoProof } from 'pshenmic-dpp'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../utils/QueryExecutor.js'
import { UInt32Value } from '../../proto/generated/google/protobuf/wrappers.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export interface EpochInfo {
  number: number
  firstBlockHeight: number
  firstCoreBlockHeight: number
  startTime: bigint
  feeMultiplier: bigint
  protocolVersion: 9
}

export default async function epochInfos (grpcPool: GRPCPool, count: number, ascending: boolean, start?: number): Promise<EpochInfo[]> {
  const getEpochsInfoRequest = GetEpochsInfoRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        startEpoch: start != null ? UInt32Value.create({ value: start }) : undefined,
        count,
        ascending,
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest(client => client.getEpochsInfo(getEpochsInfoRequest))
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        epochsInfo
      } = verifyGroveDBProof(
        verifyEpochsInfoProof,
        proof.grovedbProof,
        metadata.epoch,
        start,
        count,
        ascending,
        LATEST_PLATFORM_VERSION
      )

      const result = epochsInfo.map(info => ({
        number: info.index,
        firstBlockHeight: info.firstBlockHeight,
        firstCoreBlockHeight: info.firstCoreBlockHeight,
        startTime: info.firstBlockTime,
        feeMultiplier: info.feeMultiplierPermille,
        protocolVersion: info.protocolVersion
      })) as unknown as EpochInfo[]

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
