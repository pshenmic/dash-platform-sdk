import { IdentifierWASM, MasternodeVoteTransitionWASM, StateTransitionWASM } from 'pshenmic-dpp'
import { VoteWASM } from 'pshenmic-dpp/dist/wasm/pshenmic_dpp'

export default function createStateTransition (voteWASM: VoteWASM, proTxHash: string, identityNonce: bigint): StateTransitionWASM {
  const voterIdentity = IdentifierWASM.fromHex(proTxHash)

  const masternodeVoteTransition = new MasternodeVoteTransitionWASM(proTxHash, voterIdentity, voteWASM, identityNonce)

  return masternodeVoteTransition.toStateTransition()
}
