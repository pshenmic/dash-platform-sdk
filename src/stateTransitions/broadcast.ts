import { BroadcastStateTransitionRequest } from '../../proto/generated/platform.js'
import { StateTransitionWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool.js'

export default async function broadcast (grpcPool: GRPCConnectionPool, stateTransition: StateTransitionWASM): Promise<void> {
  if (stateTransition.signature?.length === 0) {
    throw new Error('State Transition is not signed')
  }

  const broadcastStateTransitionRequest = BroadcastStateTransitionRequest.create({
    stateTransition: stateTransition.bytes()
  })

  await grpcPool.getClient().broadcastStateTransition(broadcastStateTransitionRequest)
}
