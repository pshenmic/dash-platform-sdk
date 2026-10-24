import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { GetEpochsInfoRequest } from '../../proto/generated/platform.js'
import { verifyEpochsInfoProof } from 'pshenmic-dpp'
import QueryExecutor from '../QueryExecutor.js'
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

export default async function epochInfos (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, count: number, ascending: boolean, start?: number): Promise<EpochInfo[]> {
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

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .addGrpcRequest('getEpochsInfo', getEpochsInfoRequest)
    .addProofVerifier(verifyEpochsInfoProof, ({ metadata }) => [metadata.epoch, start, count, ascending, LATEST_PLATFORM_VERSION])
    .addMapper(data => {
      if (data.proved) {
        return data.verified.epochsInfo.map(info => ({
          number: info.index,
          firstBlockHeight: info.firstBlockHeight,
          firstCoreBlockHeight: info.firstCoreBlockHeight,
          startTime: info.firstBlockTime,
          feeMultiplier: info.feeMultiplierPermille,
          protocolVersion: info.protocolVersion
        })) as unknown as EpochInfo[]
      }

      return data.result.epochs.epochInfos.map(info => ({
        number: info.number,
        firstBlockHeight: BigInt(info.firstBlockHeight),
        firstCoreBlockHeight: info.firstCoreBlockHeight,
        startTime: BigInt(info.startTime),
        // returned as a fraction, e.g. 1.5 for 1500 permille
        feeMultiplier: BigInt(Math.round(info.feeMultiplier * 1000)),
        protocolVersion: info.protocolVersion
      })) as unknown as EpochInfo[]
    })
    .execute()
}
