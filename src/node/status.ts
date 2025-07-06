import { NodeStatus } from '../types'
import { GetStatusRequest, GetStatusResponse } from '../../proto/generated/platform'
import GRPCConnectionPool from '../grpcConnectionPool'

export default async function status (grpcPool: GRPCConnectionPool): Promise<NodeStatus> {
  const getStatusRequest = GetStatusRequest.fromPartial({ v0: {} })

  const response: GetStatusResponse = await grpcPool.getClient().getStatus(getStatusRequest)

  const { v0 } = response

  if (v0 == null) {
    throw new Error('Unable to get node status')
  }

  return {
    node: (v0.node != null)
      ? {
          id: v0.node.id.reduce((acc: string, code: number) => acc + code.toString(16), ''),
          proTxHash: v0.node.proTxHash?.reduce((acc: string, code: number) => acc + code.toString(16), '')
        }
      : undefined,
    chain: (v0.chain != null)
      ? {
          catchingUp: v0.chain.catchingUp,
          latestBlockHeight: v0.chain.latestBlockHeight,
          earliestBlockHeight: v0.chain.earliestBlockHeight,
          maxPeerBlockHeight: v0.chain.maxPeerBlockHeight,
          coreChainLockedHeight: v0.chain.coreChainLockedHeight,
          latestBlockHash: v0.chain?.latestBlockHash.reduce((acc: string, code: number) => acc + code.toString(16), ''),
          latestAppHash: v0.chain?.latestAppHash.reduce((acc: string, code: number) => acc + code.toString(16), ''),
          earliestBlockHash: v0.chain?.earliestBlockHash.reduce((acc: string, code: number) => acc + code.toString(16), ''),
          earliestAppHash: v0.chain?.earliestAppHash.reduce((acc: string, code: number) => acc + code.toString(16), '')
        }
      : undefined,
    version: v0.version,
    network: v0.network,
    stateSync: v0.stateSync,
    time: v0.time
  }
}
