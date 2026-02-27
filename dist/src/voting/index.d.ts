import { IdentifierLike, ResourceVoteChoice } from '../../types.js';
import { IdentifierWASM, StateTransitionWASM, VoteWASM } from 'pshenmic-dpp';
/**
 * Voting controller for performing masternode votes
 *
 * @hideconstructor
 */
export declare class VotingController {
    /**
     * Creates an {IdentifierWASM} from masternode pro tx hash and voting address (public key hash)
     *
     * @param proTxHash {string} voter's masternode pro tx hash
     * @param publicKeyHash {string} voter address's public key hash
     *
     * @return {Promise<IdentifierWASM>}
     */
    createVoterIdentityId(proTxHash: string, publicKeyHash: string): Promise<IdentifierWASM>;
    /**
       * Creates a {VoteWASM} with all information about the vote, such as data contract id, choice, and target index
       *
       * @param dataContractId {DataContractWASM}
       * @param documentTypeName {string}
       * @param indexName {string}
       * @param indexValues {string[]}
       * @param choice {ResourceVoteChoice}
       */
    createVote(dataContractId: IdentifierLike, documentTypeName: string, indexName: string, indexValues: string[], choice: ResourceVoteChoice): VoteWASM;
    /**
       * Creates a {StateTransitionWASM} from masternode Pro Tx Hash and voter identity
       *
       * @param voteWASM {VoteWASM} vote instance from .createMasternodeVote() method
       * @param proTxHash {string} pro tx hash of the masternode as hex
       * @param voterIdentity {IdentifierWASM} voter identity identifier
       * @param identityNonce {BigInt} identity nonce
       */
    createStateTransition(voteWASM: VoteWASM, proTxHash: string, voterIdentity: IdentifierWASM, identityNonce: bigint): StateTransitionWASM;
}
