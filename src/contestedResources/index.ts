import GRPCConnectionPool from '../grpcConnectionPool'
import { ContestedResourceVoteState, ContestedStateResultType, IdentifierLike, ResourceVoteChoice } from '../types'
import createMasternodeVote, { StartAtIdentifierInfo } from './createMasternodeVote'
import {
  DataContractWASM,
  IdentifierWASM,
  MasternodeVoteTransitionWASM,
  ResourceVoteChoiceWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { VoteWASM } from 'pshenmic-dpp/dist/wasm/pshenmic_dpp'
import getContestedResourceVoteState from './getContestedResourceVoteState'

/**
 * Contested Resources controller for requesting information about contested resources
 *
 * @hideconstructor
 */
export class ContestedResourcesController {
  /** @ignore **/
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  /**
   * Retrieves an info about vote state for contested resource
   *
   * @param contract {DataContractWASM} - instance of contract with contested resource
   * @param documentTypeName {string} - document type name of contested resource
   * @param indexName {string} - index name of contested resource
   * @param indexValuesBytes {Uint8Array[]} - Array of contested values in bytes
   * @param resultType {ContestedResourceVoteState} - enum for result info
   * @param allowIncludeLockedAndAbstainingVoteTally {boolean}
   * @param startAtIdentifierInfo {StartAtIdentifierInfo=}
   * @param count {number=}
   *
   * @return {Promise<ContestedResourceVoteState>}
   */
  async getContestedResourceVoteState (
    contract: DataContractWASM,
    documentTypeName: string,
    indexName: string,
    indexValuesBytes: Uint8Array[],
    resultType: ContestedStateResultType,
    allowIncludeLockedAndAbstainingVoteTally: boolean,
    startAtIdentifierInfo?: StartAtIdentifierInfo,
    count?: number
  ): Promise<ContestedResourceVoteState> {
    return await getContestedResourceVoteState(this.grpcPool, contract, documentTypeName, indexName, indexValuesBytes, resultType, allowIncludeLockedAndAbstainingVoteTally, startAtIdentifierInfo, count)
  }

  createMasternodeVote (dataContractId: IdentifierLike, documentTypeName: string, indexName: string, indexValues: string[], choice: ResourceVoteChoice): VoteWASM {
    let resourceVoteChoice

    if (choice === 'lock') {
      resourceVoteChoice = ResourceVoteChoiceWASM.Lock()
    } else if (choice === 'abstain') {
      resourceVoteChoice = ResourceVoteChoiceWASM.Abstain()
    } else {
      resourceVoteChoice = ResourceVoteChoiceWASM.TowardsIdentity(new IdentifierWASM(choice))
    }

    return createMasternodeVote(new IdentifierWASM(dataContractId), documentTypeName, indexName, indexValues, resourceVoteChoice)
  }

  createStateTransition (voteWASM: VoteWASM, proTxHash: string, identityNonce: bigint): StateTransitionWASM {
    const voterIdentity = IdentifierWASM.fromHex(proTxHash)

    const transition = new MasternodeVoteTransitionWASM(IdentifierWASM.fromHex(proTxHash), voterIdentity, voteWASM, identityNonce)

    return transition.toStateTransition()
  }
}
