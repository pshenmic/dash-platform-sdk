import { BroadcastStateTransitionRequest } from '../../proto/generated/platform'

export default async function broadcast (stateTransition) {
  const broadcastStateTransitionRequest = BroadcastStateTransitionRequest.fromPartial({
    stateTransition: stateTransition.toBytes()
  })

  await this.grpcPool.getClient().broadcastStateTransition(broadcastStateTransitionRequest)
}
