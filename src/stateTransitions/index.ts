import { StateTransitionWASM } from 'pshenmic-dpp'
import waitForStateTransitionResult from './waitForStateTransitionResult.js'
import broadcast from './broadcast.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'

/**
 * Collection of methods to perform state transitions (transactions) such like broadcast, wait for state transition result
 *
 * @hideconstructor
 */
export class StateTransitionsController {
  /** @ignore **/
  grpcPool: GRPCPool
  /** @ignore **/
  quorumKeyProvider: QuorumKeyProvider

  constructor (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider) {
    this.grpcPool = grpcPool
    this.quorumKeyProvider = quorumKeyProvider
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
   * Returns the owner's credit balance after the transition executed, if the proof
   * carries it (protocol v14+ owned, fee-paying transitions: document and token batches,
   * contract create and update, identity update), otherwise undefined
   *
   * @param stateTransition {StateTransitionWASM}
   *
   * @return {Promise<bigint | undefined>}
   */
  async waitForStateTransitionResult (stateTransition: StateTransitionWASM): Promise<bigint | undefined> {
    return await waitForStateTransitionResult(this.grpcPool, this.quorumKeyProvider, stateTransition)
  }
}
