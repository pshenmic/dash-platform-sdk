# Data Contracts

## Get Data Contract By Identifier

Queries a DAPI for data contract and returns a DataContractWASM instance

```javascript
const dataContractIdentifier = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

const dataContract = await sdk.dataContracts.getDataContractByIdentifier(dataContractIdentifier)
```

## Create Data Contract

Create data contract from schema

```javascript
const ownerIdentifier = 'GARSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const identityNonce = BigInt(11)

const definitions = {
  def1: true
}
const schema = {
  note: {
    type: 'object',
    properties: {
      author: { type: 'string', position: 1 },
      message: { type: 'string', position: 0 }
    },
    additionalProperties: false
  }
}

const config = {
  $format_version: '0',
  canBeDeleted: true,
  readonly: false,
  keepsHistory: false,
  documentsKeepHistoryContractDefault: false,
  documentsMutableContractDefault: true,
  documentsCanBeDeletedContractDefault: true,
  requiresIdentityEncryptionBoundedKey: null,
  requiresIdentityDecryptionBoundedKey: null
}

// Optional: tokenConfiguration for creating token-based contracts
const tokenConfiguration = {
  // token configuration properties
}

const dataContract = await sdk.dataContracts.create(
  ownerIdentifier,
  identityNonce,
  schema,
  definitions,
  true, // fullValidation
  tokenConfiguration, // optional
  config,
)
```

## Create Transition

Create a Data Contract Create Transition

```javascript
const dataContract = // ... created data contract
const identityNonce = BigInt(1)

const transition = sdk.dataContracts.createStateTransition(
  dataContract,
  'create',
  identityNonce
)
```

## Update Transition

Create a Data Contract Update Transition

```javascript
const dataContract = // ... existing data contract with updates
const identityNonce = BigInt(2)

const transition = sdk.dataContracts.createStateTransition(
  dataContract,
  'update',
  identityNonce
)
```
