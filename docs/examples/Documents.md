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
// identity contract nonce of the transition that will create the document, used to generate the document id
const identityContractNonce = await sdk.identities.getIdentityContractNonce(ownerId, dataContractId) + 1n

const document = await sdk.documents.create(dataContractId, documentType, data, ownerId, identityContractNonce, revision)

console.log(document)
```

## Create a Contested Resource Document

Creates a DocumentWASM instance with a prefunded voting balance for contested DPNS names

```javascript
// ...
const identityContractNonce = await sdk.identities.getIdentityContractNonce(identity, dataContract) + 1n
const document = sdk.documents.create(dataContract, documentType, data, identity, identityContractNonce)

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
const identityContractNonce = BigInt(1)
const document = sdk.documents.create(dataContract, documentType, data, identity, identityContractNonce)

const tokenPaymentInfo = {
  tokenContractId: '6hVQW16jyvZyGSQk2YVty4ND6bgFXozizYWnPt753uW5',
  tokenContractPosition: 0,
  minimumTokenCost: BigInt(1000),
  maximumTokenCost: BigInt(100000),
  gasFeesPaidBy: GasFeesPaidByWASM.ContractOwner
}

const stateTransition = sdk.documents.createStateTransition(document, 'create', { identityContractNonce, tokenPaymentInfo })
```

## Agree to Document Action Fees

A document type may charge credits for an action to the contract owner and moderators (`actionFees` in its schema).
A transition on such a type must carry an agreement naming the fee its signer saw declared, otherwise the network refuses it.
The network also refuses it when the declared fee changed since. For a fee priced by the epoch fee multiplier, the agreement names
the multiplier of the current epoch and how much it may grow before the transition executes

```javascript
// reads the contract and the fee multiplier of the current epoch, undefined when the action charges no fee
const increaseTolerancePercent = 10
const actionFeeAgreement = await sdk.documents.getActionFeeAgreement(dataContractId, documentType, 'create', increaseTolerancePercent)

const stateTransition = sdk.documents.createStateTransition(document, 'create', { identityContractNonce, actionFeeAgreement })
```

Or as a plain object:

```javascript
const actionFeeAgreement = {
  owner: BigInt(10000000),
  moderators: BigInt(0),
  // omit for a fixed fee
  feeMultiplier: { knownPermille: BigInt(1000), increaseTolerancePercent: 10 }
}
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

Besides the classic operators, where clauses support `contains` and `containsAny` on typed arrays,
and window selections on `timeRange` / `integerRange` indexes:

```javascript
const where = [
  ['tags', 'contains', 'dash'],
  ['$createdAt', 'inTimeRange', 'newest'], // or 'oldest', a window start in ms, or { selector, startMs, grid }
  ['height', 'inIntegerRange', { start: 100, grid: { range: 10, step: 10 } }]
]
```

## Count, Sum and Average Documents

Aggregates need a `countable` / `rangeCountable` (or summable) index covering the where clause.
Without `groupBy` the result has one entry with the total, with `groupBy` one entry per group

```javascript
const query = {
  documentTypeName: 'payment',
  where: [['status', 'in', ['PAID', 'REFUNDED']]],
  groupBy: ['status']
}

const { mode, entries } = await sdk.documents.count(dataContractId, query)
const sums = await sdk.documents.sum(dataContractId, query, 'amount')
// average entries carry count and sum, the average is sum / count
const averages = await sdk.documents.average(dataContractId, query, 'amount')

console.log(entries) // [{ inKey, key, count }]
```

## Ranked (Top-K) and Having Queries

Groups ranked by an aggregate. Order by the aggregated field, or by `$count` for count

```javascript
const { skipped, entries } = await sdk.documents.ranked(dataContractId, {
  documentTypeName: 'payment',
  select: { function: 'count' },
  groupBy: ['merchant'],
  orderBy: [['$count', 'desc']],
  limit: 10,
  offset: 0
})

const groups = await sdk.documents.having(dataContractId, {
  documentTypeName: 'payment',
  select: { function: 'sum', field: 'amount' },
  groupBy: ['merchant'],
  having: [{ function: 'sum', field: 'amount', operator: '>=', value: 1000 }]
})
```

## Chained and Composite Queries

```javascript
// documents of `review`, then the `product` documents their `productId` refers to
const { innerDocuments, outerDocuments, missingOuterIds, removedOuterDocuments } = await sdk.documents.chained(
  dataContractId,
  { documentTypeName: 'review', limit: 10 },
  'productId',
  'product'
)

// a page plus up to 10 sub-queries bound to values of the page or an earlier sub-query
const { pageDocuments, subResults } = await sdk.documents.composite(
  dataContractId,
  { documentTypeName: 'product', limit: 10 },
  [
    { documentTypeName: 'review', kind: 'count', binding: { source: 'page', sourceProperty: '$id', field: 'productId' } }
  ]
)
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
