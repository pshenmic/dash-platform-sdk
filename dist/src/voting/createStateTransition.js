import { IdentifierWASM, MasternodeVoteTransitionWASM } from 'pshenmic-dpp';
export default function createStateTransition(voteWASM, proTxHash, identityNonce) {
    const voterIdentity = IdentifierWASM.fromHex(proTxHash);
    const masternodeVoteTransition = new MasternodeVoteTransitionWASM(proTxHash, voterIdentity, voteWASM, identityNonce);
    return masternodeVoteTransition.toStateTransition();
}
