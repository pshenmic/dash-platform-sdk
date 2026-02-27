import { IdentifierWASM, StateTransitionWASM, TokenBaseTransitionWASM } from 'pshenmic-dpp';
import { TokenTransitionParams, TokenTransitionType } from '../../types.js';
export default function createStateTransition(base: TokenBaseTransitionWASM, ownerId: IdentifierWASM, type: TokenTransitionType, params: TokenTransitionParams): StateTransitionWASM;
