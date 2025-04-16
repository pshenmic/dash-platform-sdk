import { BroadcastStateTransitionRequest } from '../../proto/generated/platform'

export default async function broadcast (stateTransition) {
  // eslint-disable-next-line new-cap
  const broadcastStateTransitionRequest = new BroadcastStateTransitionRequest.fromPartial({
    stateTransition: stateTransition.toBytes()
  })

  await this.grpcPool.getClient().broadcastStateTransition(broadcastStateTransitionRequest)
}
