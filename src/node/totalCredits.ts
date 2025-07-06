import {
  GetTotalCreditsInPlatformRequest,
  GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0
} from "../../proto/generated/platform";
import GRPCConnectionPool from "../grpcConnectionPool";

export default async function totalCredits (grpcPool: GRPCConnectionPool): Promise<bigint> {
  const request = GetTotalCreditsInPlatformRequest.fromPartial({v0:{}})

  const { v0 } = await grpcPool.getClient().getTotalCreditsInPlatform(request)

  const { credits } = v0 as GetTotalCreditsInPlatformResponse_GetTotalCreditsInPlatformResponseV0

  return BigInt(credits as string)
}