import { BroadcastStateTransitionRequest } from '../../proto/generated/platform'

export default async function broadcast (stateTransition) {
  // eslint-disable-next-line new-cap
  const broadcastStateTransitionRequest = new BroadcastStateTransitionRequest.fromPartial({
    v0: {
      stateTransition: stateTransition.toBuffer()
    }
  })

  await this.grpcPool.getClient().broadcastStateTransition(broadcastStateTransitionRequest)
}
