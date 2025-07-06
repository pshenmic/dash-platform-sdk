import GRPCConnectionPool from "../grpcConnectionPool";
import {GetEpochsInfoRequest} from "../../proto/generated/platform";

export default async function epochs(grpcPool: GRPCConnectionPool, count: number, start?: number, ascending?: boolean) {
  const request = GetEpochsInfoRequest.fromPartial({
    v0: {
      startEpoch: start,
      count,
      ascending
    }
  })

  const { v0 } = await grpcPool.getClient().getEpochsInfo(request);
}