import { IdentifierLike, ResourceVoteChoice } from '../types'
import createVote from './createVote'
import { IdentifierWASM, MasternodeVoteTransitionWASM, ResourceVoteChoiceWASM, StateTransitionWASM } from 'pshenmic-dpp'
import { VoteWASM } from 'pshenmic-dpp/dist/wasm/pshenmic_dpp'
import { createVoterIdentityId } from '../utils/createVoterIdentityId'

/**
 * Voting controller for performing masternode votes
 *
 * @hideconstructor
 */
export class VotingController {
  /**
   * Creates an {IdentifierWASM} from masternode pro tx hash and voting address (public key hash)
   *
   * @param proTxHash {string} voter's masternode pro tx hash
   * @param publicKeyHash {string} voter address's public key hash
   *
   * @return {IdentifierWASM}
   */
  createVoterIdentityId (proTxHash: string, publicKeyHash: string): IdentifierWASM {
    return createVoterIdentityId(proTxHash, publicKeyHash)
  }

  /**
     * Creates a {VoteWASM} with all information about the vote, such as data contract id, choice, and target index
     *
     * @param dataContractId {DataContractWASM}
     * @param documentTypeName {string}
     * @param indexName {string}
     * @param indexValues {string[]}
     * @param choice {ResourceVoteChoice}
     */
  createVote (dataContractId: IdentifierLike, documentTypeName: string, indexName: string, indexValues: string[], choice: ResourceVoteChoice): VoteWASM {
    let resourceVoteChoice

    if (choice === 'lock') {
      resourceVoteChoice = ResourceVoteChoiceWASM.Lock()
    } else if (choice === 'abstain') {
      resourceVoteChoice = ResourceVoteChoiceWASM.Abstain()
    } else {
      resourceVoteChoice = ResourceVoteChoiceWASM.TowardsIdentity(new IdentifierWASM(choice))
    }

    return createVote(new IdentifierWASM(dataContractId), documentTypeName, indexName, indexValues, resourceVoteChoice)
  }

  /**
     * Creates a {StateTransitionWASM} from masternoe protxhash and voter identity
     *
     * @param voteWASM {VoteWASM} vote instance from .createMsternodeVote() method
     * @param proTxHash {string} pro tx hash of the masternode as hex
     * @param voterIdentity {IdentifierWASM} voter identity identifier
     * @param identityNonce {BigInt} identity nonce
     */
  createStateTransition (voteWASM: VoteWASM, proTxHash: string, voterIdentity: IdentifierWASM, identityNonce: bigint): StateTransitionWASM {
    const transition = new MasternodeVoteTransitionWASM(IdentifierWASM.fromHex(proTxHash), new IdentifierWASM(voterIdentity), voteWASM, identityNonce)

    return transition.toStateTransition()
  }
}
