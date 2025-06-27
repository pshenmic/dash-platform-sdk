import { BroadcastStateTransitionRequest } from '../../proto/generated/platform'
import { StateTransitionWASM } from 'pshenmic-dpp'

export default async function broadcast (stateTransition: StateTransitionWASM): Promise<void> {
  const broadcastStateTransitionRequest = BroadcastStateTransitionRequest.fromPartial({
    stateTransition: stateTransition.bytes()
  })

  await this.grpcPool.getClient().broadcastStateTransition(broadcastStateTransitionRequest)
}
