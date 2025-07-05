import { WaitForStateTransitionResultRequest } from '../../proto/generated/platform'
import { StateTransitionWASM } from 'pshenmic-dpp'

export default async function waitForStateTransitionResult (stateTransition: StateTransitionWASM): Promise<void> {
  const waitForStateTransitionResultRequest = WaitForStateTransitionResultRequest.fromPartial({
    v0: {
      stateTransitionHash: stateTransition.bytes()
    }
  })

  const { v0 } = await this.grpcPool.getClient().waitForStateTransitionResult(waitForStateTransitionResultRequest)

  const { error } = v0

  if (error != null) {
    throw new Error(error)
  }
}
