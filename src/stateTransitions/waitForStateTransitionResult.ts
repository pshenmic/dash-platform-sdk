import {
  WaitForStateTransitionResultRequest,
  WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0
} from '../../proto/generated/platform'
import { StateTransitionWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool'

export default async function waitForStateTransitionResult (grpcPool: GRPCConnectionPool, stateTransition: StateTransitionWASM): Promise<void> {
  const waitForStateTransitionResultRequest = WaitForStateTransitionResultRequest.fromPartial({
    v0: {
      stateTransitionHash: stateTransition.bytes()
    }
  })

  const { v0 } = await grpcPool.getClient().waitForStateTransitionResult(waitForStateTransitionResultRequest)

  const { error } = v0 as WaitForStateTransitionResultResponse_WaitForStateTransitionResultResponseV0

  if (error != null) {
    // todo return error structure
    throw new Error(error.message)
  }
}
