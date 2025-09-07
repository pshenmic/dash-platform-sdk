import {
  GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo
} from '../../proto/generated/platform'
import { IdentifierWASM, ResourceVoteChoiceWASM, VotePollWASM } from 'pshenmic-dpp'
import { VoteWASM } from 'pshenmic-dpp/dist/wasm/pshenmic_dpp'

export type StartAtIdentifierInfo = GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo

export default function vote (dataContractId: IdentifierWASM, documentTypeName: string, indexName: string, indexValues: string[], choice: ResourceVoteChoiceWASM): VoteWASM {
  const votePoll = new VotePollWASM(dataContractId, documentTypeName, indexName, indexValues)

  return new VoteWASM(votePoll, choice)
}
