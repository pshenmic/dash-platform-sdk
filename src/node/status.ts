import { NodeStatus } from '../types'
import { GetStatusRequest, GetStatusResponse } from '../../proto/generated/platform'
import GRPCConnectionPool from '../grpcConnectionPool'
import bytesToHex from '../utils/bytesToHex'

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
          id: bytesToHex(v0.node.id),
          proTxHash: v0.node.proTxHash != null ? bytesToHex(v0.node.proTxHash) : undefined
        }
      : undefined,
    chain: (v0.chain != null)
      ? {
          catchingUp: v0.chain.catchingUp,
          latestBlockHeight: v0.chain.latestBlockHeight,
          earliestBlockHeight: v0.chain.earliestBlockHeight,
          maxPeerBlockHeight: v0.chain.maxPeerBlockHeight,
          coreChainLockedHeight: v0.chain.coreChainLockedHeight,
          latestBlockHash: v0.chain?.latestBlockHash != null ? bytesToHex(v0.chain?.latestBlockHash) : '',
          latestAppHash: v0.chain?.latestAppHash != null ? bytesToHex(v0.chain?.latestAppHash) : '',
          earliestBlockHash: v0.chain?.earliestBlockHash != null ? bytesToHex(v0.chain?.earliestBlockHash) : '',
          earliestAppHash: v0.chain?.earliestAppHash != null ? bytesToHex(v0.chain?.earliestAppHash) : ''

        }
      : undefined,
    version: v0.version,
    network: v0.network,
    stateSync: v0.stateSync,
    time: v0.time
  }
}
