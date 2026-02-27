import { StateTransitionWASM } from 'pshenmic-dpp';
import GRPCConnectionPool from '../grpcConnectionPool.js';
/**
 * Collection of methods to perform state transitions (transactions) such like broadcast, wait for state transition result
 *
 * @hideconstructor
 */
export declare class StateTransitionsController {
    /** @ignore **/
    grpcPool: GRPCConnectionPool;
    constructor(grpcPool: GRPCConnectionPool);
    /**
     * Broadcasts a state transition to a network
     *
     * @param stateTransition {StateTransitionWASM}
     *
     * @return {Promise<void>}
     */
    broadcast(stateTransition: StateTransitionWASM): Promise<void>;
    /**
     * Waits for a given state transition to finalize in the network (usually 1-3 sec)
     *
     * @param stateTransition {StateTransitionWASM}
     *
     * @return {Promise<void>}
     */
    waitForStateTransitionResult(stateTransition: StateTransitionWASM): Promise<void>;
}
