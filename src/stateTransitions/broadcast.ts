import { BroadcastStateTransitionRequest } from '../../proto/generated/platform'
import { StateTransitionWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool'

export default async function broadcast (grpcPool: GRPCConnectionPool, stateTransition: StateTransitionWASM): Promise<void> {
  const broadcastStateTransitionRequest = BroadcastStateTransitionRequest.fromPartial({
    stateTransition: stateTransition.bytes()
  })

  await grpcPool.getClient().broadcastStateTransition(broadcastStateTransitionRequest)
}
