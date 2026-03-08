# Voting

## Masternode Vote

Perform a masternode vote for a contested resource (e.g. a DPNS name)

```javascript
const dataContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const documentTypeName = 'domain'
const indexName = 'parentNameAndLabel'
const indexValues = ['dash', sdk.names.normalizeLabel('testidentity')]
const proTxHash = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'
const privateKey = PrivateKeyWASM.fromHex('deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', 'testnet')

// choice can be an identity identifier (towards), 'lock', or 'abstain'
const choice: ResourceVoteChoice = 'CKKYnVeKoxCbvuEhiT6MDoQaRyXgDECwtxoKL5cqucZE' // towards identity
// const choice: ResourceVoteChoice = 'lock'
// const choice: ResourceVoteChoice = 'abstain'

// fetch voter identity
const voterIdentifier = await sdk.voting.createVoterIdentityId(proTxHash, privateKey.getPublicKeyHash())
const voterIdentity = await sdk.identities.getIdentityByIdentifier(voterIdentifier)

// get voter identity public key
const [identityPublicKey] = voterIdentity.getPublicKeys().filter(
  key => privateKey.getPublicKeyHash() === key.getPublicKeyHash()
)
const identityNonce = await sdk.identities.getIdentityNonce(voterIdentity.id)

// create and sign vote
const vote = sdk.voting.createVote(dataContractId, documentTypeName, indexName, indexValues, choice)
const stateTransition = sdk.voting.createStateTransition(vote, proTxHash, voterIdentity.id, identityNonce + BigInt(1))

stateTransition.sign(privateKey, identityPublicKey)

await sdk.stateTransitions.broadcast(stateTransition)
```
