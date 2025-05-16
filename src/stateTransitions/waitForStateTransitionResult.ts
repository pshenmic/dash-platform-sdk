import { WaitForStateTransitionResultRequest } from '../../proto/generated/platform'

export default async function waitForStateTransitionResult (stateTransitionHash: Uint8Array<ArrayBufferLike>): Promise<void> {
  const waitForStateTransitionResultRequest = WaitForStateTransitionResultRequest.fromPartial({
    v0: {
      stateTransitionHash
    }
  })

  const { v0 } = await this.grpcPool.getClient().waitForStateTransitionResult(waitForStateTransitionResultRequest)

  const { error } = v0

  if (error !== undefined) {
    throw new Error(error)
  }
}
