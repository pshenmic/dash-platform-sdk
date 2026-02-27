import { StateTransitionWASM } from 'pshenmic-dpp';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function waitForStateTransitionResult(grpcPool: GRPCConnectionPool, stateTransition: StateTransitionWASM): Promise<void>;
