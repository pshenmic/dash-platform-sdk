import { IdentifierWASM, ResourceVoteChoiceWASM, VotePollWASM, VoteWASM } from 'pshenmic-dpp'

export default function createVote (dataContractId: IdentifierWASM, documentTypeName: string, indexName: string, indexValues: string[], choice: ResourceVoteChoiceWASM): VoteWASM {
  const votePoll = new VotePollWASM(dataContractId, documentTypeName, indexName, indexValues)

  return new VoteWASM(votePoll, choice)
}
