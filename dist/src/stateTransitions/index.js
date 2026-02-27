import waitForStateTransitionResult from './waitForStateTransitionResult.js';
import broadcast from './broadcast.js';
/**
 * Collection of methods to perform state transitions (transactions) such like broadcast, wait for state transition result
 *
 * @hideconstructor
 */
export class StateTransitionsController {
    /** @ignore **/
    grpcPool;
    constructor(grpcPool) {
        this.grpcPool = grpcPool;
    }
    /**
     * Broadcasts a state transition to a network
     *
     * @param stateTransition {StateTransitionWASM}
     *
     * @return {Promise<void>}
     */
    async broadcast(stateTransition) {
        return await broadcast(this.grpcPool, stateTransition);
    }
    /**
     * Waits for a given state transition to finalize in the network (usually 1-3 sec)
     *
     * @param stateTransition {StateTransitionWASM}
     *
     * @return {Promise<void>}
     */
    async waitForStateTransitionResult(stateTransition) {
        return await waitForStateTransitionResult(this.grpcPool, stateTransition);
    }
}
