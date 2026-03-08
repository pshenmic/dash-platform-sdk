# Quickstart

## Register your Data Contract

Before you start storing your data in the decentralized storage, you must provide the schema of
your data contract. Very similar to traditional databases, you first define the schema, and then
can start inserting data according the format you defined.

https://docs.dash.org/projects/platform/en/stable/docs/protocol-ref/data-contract.html

After you define your application schema, you may proceed to registering your data contract in the
network:

```javascript
const owner = 'GARSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec' // identifier of your identity
const identityNonce = await sdk.identities.getIdentityNonce(owner) // nonce

const schema = {
  note: {
    type: 'object',
    properties: {
      message: { type: 'string', position: 0 }
    },
    additionalProperties: false
  }
}

// Create DataContractWASM instance
const dataContract = await sdk.dataContracts.create(
  ownerIdentifier,
  identityNonce,
  schema,
)

// Turn it into StateTransitionWASM
const stateTransition = sdk.dataContracts.createStateTransition(dataContract, 'create', identityNonce)

// Broadcast in the network
await sdk.stateTransitions.broadcast(stateTransition)
```

## Push your data in your Data Contract

After you have your Data Contract deployed in the network, you can start inserting your application
data. This is done via creating a document in the network:

```javascript
const dataContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const ownerId = '9VSMojGcwpFHeWnAZzYxJipFt1t3mb34BWtHt8csizQS'
const documentType = 'note'
const revision = BigInt(1)

const identityContractNonce = await sdk.identities.getIdentityContractNonce(ownerId, dataContractId) // nonce

const data = {
    "message": "Hello world!",
}

// Create DocumentWASM instance
const document = await sdk.documents.create(dataContractId, documentType, data, ownerId, revision)

// Turn it into StateTransitionWASM
const stateTransition = sdk.documents.createStateTransition(document, 'create', { identityContractNonce })

// Broadcast transaction
await sdk.stateTransitions.broadcast(stateTransition)
```

## Update the document

It is possible to update your document if you wish to change the data in your document. This
is done by creating a Document Replace Transition in the network:

```javascript
const dataContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const ownerId = '9VSMojGcwpFHeWnAZzYxJipFt1t3mb34BWtHt8csizQS'
const documentType = 'note'

// Get DocumentWASM from the network
const [document] = await sdk.documents.query(
  dataContractId,
  documentType,
  [['ownerId', '==', ownerId]], // or any other query
)

// Get last identity contract nonce
const identityContractNonce = await sdk.identities.getIdentityContractNonce(ownerId, dataContractId) // nonce

// Turn it into StateTransitionWASM
const stateTransition = sdk.documents.createStateTransition(document, 'replace', { identityContractNonce: identityContractNonce + 1n })

// Broadcast transaction
await sdk.stateTransitions.broadcast(stateTransition)
```

## Delete the document

You can delete the document from the state, and it will not be longer available to query from DAPI.

```javascript
const dataContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const ownerId = '9VSMojGcwpFHeWnAZzYxJipFt1t3mb34BWtHt8csizQS'
const documentType = 'note'

const identityContractNonce = await sdk.identities.getIdentityContractNonce(ownerId, dataContractId) // nonce

// Get DocumentWASM instance from the network
const [document] = await sdk.documents.query(dataContractId, documentType, [['$ownerId', '==', ownerId]])

// Turn it into StateTransitionWASM
const stateTransition = sdk.documents.createStateTransition(document, 'delete', { identityContractNonce })

// Broadcast transaction
await sdk.stateTransitions.broadcast(stateTransition)
```
