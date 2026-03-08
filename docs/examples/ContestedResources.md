# Contested Resources

## Get Contested Resource Vote State

Retrieves the current vote tally and contender list for a contested resource (e.g. a DPNS name under masternode vote)

```javascript
import { ContestedStateResultType } from 'dash-platform-sdk'

const dataContract = await sdk.dataContracts.getDataContractByIdentifier('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
const documentTypeName = 'domain'
const indexName = 'parentNameAndLabel'

// index values must be encoded as bytes
const indexValuesBytes = [
  sdk.utils.hexToBytes(/* encoded 'dash' */),
  sdk.utils.hexToBytes(/* encoded normalized label */)
]

const voteState = await sdk.contestedResources.getContestedResourceVoteState(
  dataContract,
  documentTypeName,
  indexName,
  indexValuesBytes,
  ContestedStateResultType.DOCUMENTS_AND_VOTE_TALLY,
  true // include locked and abstaining vote tally
)

console.log(voteState.contenders)
console.log(voteState.abstainVoteTally)
console.log(voteState.lockVoteTally)
console.log(voteState.finishedVoteInfo)
```

### Result Types

| Value | Description |
|-------|-------------|
| `ContestedStateResultType.DOCUMENTS` | Returns contender documents only |
| `ContestedStateResultType.VOTE_TALLY` | Returns vote counts only |
| `ContestedStateResultType.DOCUMENTS_AND_VOTE_TALLY` | Returns both documents and vote counts |
