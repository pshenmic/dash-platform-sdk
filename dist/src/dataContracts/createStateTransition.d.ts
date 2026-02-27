import { DataContractWASM, StateTransitionWASM } from 'pshenmic-dpp';
export declare enum DataContractTransitionType {
    Create = 0,
    Update = 1
}
export default function createStateTransition(dataContract: DataContractWASM, type: 'create' | 'update', identityNonce: bigint): StateTransitionWASM;
