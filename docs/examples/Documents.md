# Documents

## Create Document

Creates a DocumentWASM instance that can be used for a state transition creation

```javascript
const dataContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const ownerId = '9VSMojGcwpFHeWnAZzYxJipFt1t3mb34BWtHt8csizQS'
const documentType = 'domain'
const data = {
  "label": "mydomain",
  "normalizedLabel": "mydomain",
  "normalizedParentDomainName": "dash",
  "records": {
    "dashUniqueIdentityId": ownerId
  }
}
const revision = BigInt(1) // optional, defaults to 1

const document = await sdk.documents.create(dataContractId, documentType, data, ownerId, revision)

console.log(document)
```

## Create a Contested Resource Document

Creates a DocumentWASM instance with a prefunded voting balance for contested DPNS names

```javascript
// ...
const document = sdk.documents.create(dataContract, documentType, data, identity)
const identityContractNonce = await sdk.identities.getIdentityContractNonce(identity, dataContract)

// 0.2 Dash typically
const contestedFee = BigInt(20000000000)
const indexName = 'parentNameAndLabel'

const prefundedVotingBalance = { indexName, amount: contestedFee }

const stateTransition = sdk.documents.createStateTransition(document, 'create', { identityContractNonce, prefundedVotingBalance })
```

## Pay with Token for a Document Transition

Some data contracts may define a cost for a document transition to be performed in the data contract.

The token cost fee can be charged from either ContractOwner or Document Owner and it is specified in the data contract schema

```javascript
// ...
const document = sdk.documents.create(dataContract, documentType, data, identity)
const identityContractNonce = BigInt(1)

const tokenPaymentInfo = {
  tokenContractId: '6hVQW16jyvZyGSQk2YVty4ND6bgFXozizYWnPt753uW5',
  tokenContractPosition: 0,
  minimumTokenCost: BigInt(1000),
  maximumTokenCost: BigInt(100000),
  gasFeesPaidBy: GasFeesPaidByWASM.ContractOwner
}

const stateTransition = sdk.documents.createStateTransition(document, 'create', { identityContractNonce, tokenPaymentInfo })
```

## Query Documents

Performs a query for documents and returns an array of DocumentWASM instances

```javascript
const dataContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const documentType = 'domain'
const limit = 100
const where = [['$ownerId', '==', ownerId]]
const orderBy = [['$createdAt', 'desc']]

// optional: pagination options (use only one)
const startAt = document.id // for pagination
const startAfter = document.id // for pagination

const documents = await sdk.documents.query(
  dataContractId,
  documentType,
  where,
  orderBy,
  limit,
  startAt,
  startAfter
)

console.log(documents)
```

## Document State Transitions

This method allows creation of various document state transitions

```javascript
const document = // ... created or fetched document
const identityContractNonce = BigInt(1)

// Create transition
const createTransition = sdk.documents.createStateTransition(
  document,
  'create',
  { identityContractNonce }
)

// Replace transition
const replaceTransition = sdk.documents.createStateTransition(
  document,
  'replace',
  { identityContractNonce }
)

// Delete transition
const deleteTransition = sdk.documents.createStateTransition(
  document,
  'delete',
  { identityContractNonce }
)

// Purchase transition (requires amount parameter)
const purchaseTransition = sdk.documents.createStateTransition(
  document,
  'purchase',
  { identityContractNonce, amount: BigInt(100) }
)

// Transfer transition (requires recipientId parameter)
const transferTransition = sdk.documents.createStateTransition(
  document,
  'transfer',
  { identityContractNonce, recipientId: '8VSMojGcwpFHeWnAZzYxJipFt1t3mb34BWtHt8csizQS' }
)

// Update price transition (requires price parameter)
const updatePriceTransition = sdk.documents.createStateTransition(
  document,
  'updatePrice',
  { identityContractNonce, price: BigInt(200) }
)
```
