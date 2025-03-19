import { WaitForStateTransitionResultRequest } from '../../proto/generated/platform'

export default async function WaitForStateTransitionResult (stateTransitionHash) {
  // eslint-disable-next-line new-cap
  const waitForStateTransitionResultRequest = new WaitForStateTransitionResultRequest.fromPartial({
    v0: {
      stateTransitionHash
    }
  })

  const { v0 } = await this.grpcPool.getClient().waitForStateTransitionResult(waitForStateTransitionResultRequest)

  const { error } = v0

  if (error) {
    throw new Error(error)
  }
}
