import { VotePollWASM, VoteWASM } from 'pshenmic-dpp';
export default function createVote(dataContractId, documentTypeName, indexName, indexValues, choice) {
    const votePoll = new VotePollWASM(dataContractId, documentTypeName, indexName, indexValues);
    return new VoteWASM(votePoll, choice);
}
