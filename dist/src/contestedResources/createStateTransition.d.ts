import { StateTransitionWASM, VoteWASM } from 'pshenmic-dpp';
export default function createStateTransition(voteWASM: VoteWASM, proTxHash: string, identityNonce: bigint): StateTransitionWASM;
