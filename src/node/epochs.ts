import GRPCConnectionPool from '../grpcConnectionPool'
import {
  GetEpochsInfoRequest,
  GetEpochsInfoResponse_GetEpochsInfoResponseV0,
  GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo
} from '../../proto/generated/platform'

export type EpochInfo = GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo

export default async function epochs (grpcPool: GRPCConnectionPool, count: number, start?: number, ascending?: boolean): Promise<EpochInfo[]> {
  const request = GetEpochsInfoRequest.fromPartial({
    v0: {
      startEpoch: start,
      count,
      ascending
    }
  })

  const { v0 } = await grpcPool.getClient().getEpochsInfo(request)

  const { epochs } = v0 as GetEpochsInfoResponse_GetEpochsInfoResponseV0

  return epochs?.epochInfos ?? []
}
