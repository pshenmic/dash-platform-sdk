import { BroadcastStateTransitionRequest } from '../../proto/generated/platform.js'
import { StateTransitionWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import { deserializeConsensusError } from '../utils/deserializeConsensusError.js'

export default async function broadcast (grpcPool: GRPCConnectionPool, stateTransition: StateTransitionWASM): Promise<void> {
  try {
    if (stateTransition.signature?.length === 0) {
      throw new Error('State Transition is not signed')
    }

    const broadcastStateTransitionRequest = BroadcastStateTransitionRequest.create({
      stateTransition: stateTransition.bytes()
    })

    await grpcPool.getClient().broadcastStateTransition(broadcastStateTransitionRequest)
  } catch (err) {
    const errorBin = err.meta?.['dash-serialized-consensus-error-bin']

    if (errorBin?.length !== 0 && errorBin != null) {
      throw new Error(deserializeConsensusError(errorBin))
    } else {
      throw err
    }
  }
}
