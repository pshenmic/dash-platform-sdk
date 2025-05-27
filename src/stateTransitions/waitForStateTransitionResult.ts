import { WaitForStateTransitionResultRequest } from '../../proto/generated/platform'

export default async function waitForStateTransitionResult (stateTransitionHash: Uint8Array): Promise<void> {
  const waitForStateTransitionResultRequest = WaitForStateTransitionResultRequest.fromPartial({
    v0: {
      stateTransitionHash
    }
  })

  const { v0 } = await this.grpcPool.getClient().waitForStateTransitionResult(waitForStateTransitionResultRequest)

  const { error } = v0

  if (error != null) {
    throw new Error(error)
  }
}
