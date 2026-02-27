import { StateTransitionWASM } from 'pshenmic-dpp';
import { IdentityTransitionParams } from '../../types.js';
export default function createStateTransition(type: 'create' | 'update' | 'topUp' | 'creditTransfer' | 'withdrawal', params: IdentityTransitionParams): StateTransitionWASM;
