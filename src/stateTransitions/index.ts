import {
  StateTransitionWASM
} from 'pshenmic-dpp'
import waitForStateTransitionResult from './waitForStateTransitionResult'
import broadcast from './broadcast'
import GRPCConnectionPool from '../grpcConnectionPool'

export class StateTransitionsController {
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  async broadcast (stateTransition: StateTransitionWASM): Promise<void> {
    return await broadcast(stateTransition)
  }

  async waitForStateTransitionResult (stateTransition: StateTransitionWASM): Promise<void> {
    return await waitForStateTransitionResult(stateTransition)
  }
}
