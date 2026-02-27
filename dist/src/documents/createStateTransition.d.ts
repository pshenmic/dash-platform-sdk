import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp';
import { DocumentTransitionParams } from '../../types.js';
export default function createStateTransition(document: DocumentWASM, type: 'create' | 'replace' | 'delete' | 'updatePrice' | 'transfer' | 'purchase', params: DocumentTransitionParams): StateTransitionWASM;
