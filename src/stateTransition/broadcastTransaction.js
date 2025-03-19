import { BroadcastStateTransitionRequest } from '../../proto/generated/platform'

export default async function broadcastTransaction(stateTransition) {
  const broadcastStateTransitionRequest = new BroadcastStateTransitionRequest.fromPartial({
    v0: {
      stateTransition: stateTransition.toBuffer()
    }
  })

  await this.client.broadcastStateTransition(broadcastStateTransitionRequest)
}
