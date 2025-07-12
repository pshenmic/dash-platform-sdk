import { StateTransitionWASM } from 'pshenmic-dpp'
import waitForStateTransitionResult from './waitForStateTransitionResult'
import broadcast from './broadcast'
import GRPCConnectionPool from '../grpcConnectionPool'

/**
 * Collection of methods to perform state transitions (transactions) such like broadcast, wait for state transition result
 *
 * @hideconstructor
 */
export class StateTransitionsController {
  /** @ignore **/
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  /**
   * Broadcasts a state transition to a network
   *
   * @param stateTransition {StateTransitionWASM}
   *
   * @return {Promise<void>}
   */
  async broadcast (stateTransition: StateTransitionWASM): Promise<void> {
    return await broadcast(this.grpcPool, stateTransition)
  }

  /**
   * Waits for a given state transition to finalize in the network (usually 1-3 sec)
   *
   * @param stateTransition {StateTransitionWASM}
   *
   * @return {Promise<void>}
   */
  async waitForStateTransitionResult (stateTransition: StateTransitionWASM): Promise<void> {
    return await waitForStateTransitionResult(this.grpcPool, stateTransition)
  }
}
