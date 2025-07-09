# dash-platform-sdk v1.0.6-rc.4
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/pshenmic/dash-platform-sdk/blob/master/LICENSE) ![npm version](https://img.shields.io/npm/v/react.svg?style=flat) ![a](https://github.com/pshenmic/platform-explorer/actions/workflows/build.yml/badge.svg)


This is Javascript SDK for Dash Platform chain that let you make queries, create, and sign state
transitions locally and broadcast them into network

It uses an WASM bindings layer to a Dash Platform Protocol to create documents, sign transactions and validate provable query responses.

SDK uses a pre-defined set of seed nodes (public RPC) at the start, and then tries to switch to the latest list of nodes fetched from the Dash network through https://rpc.digitalcash.dev if possible

### This is development version, breaking changes may be each release

Currently, only minimal features are included, such as document querying and creation of the documents, and all necessary related functions to do that
There is no input validation and error handling implemented yet relying on a happy path, this is going to be fixed in next versions

This library is isomorphic and works in both Node.js and Web browsers without polyfilling

## Browser Support

The SDK is isomorphic and works in both Node.js and web browsers without requiring polyfills. When using in browsers, make sure to include the library from CDN or bundle it with your application.


## Install

```bash
$ npm install dash-platform-sdk
```

Alternatively, you could simply include the library from the CDN:

https://unpkg.com/dash-platform-sdk/dist/main.js

## Quickstart
To use the SDK, simply import the library and instantiate an instance of DashPlatformSDK:
```javascript
// ES6 / EcmaScript
import {DashPlatformSDK} from 'dash-platform-sdk'

// CommonJS
const {DashPlatformSDK} = require('dash-platform-sdk')

const sdk = new DashPlatformSDK({network: 'testnet'})
```

Or load it straight from the web page:

```html
<script src="https://unpkg.com/dash-platform-sdk/dist/main.js"></script>
<script>
    const sdk = new DashPlatformSDK({network: 'testnet'})
</script>
```


## API Documentation

###  Data Contracts

#### Get Data Contract By Identifier

Queries a DAPI for data contract and returns a DataContractWASM instance

```javascript
const dataContractIdentifier = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

const dataContract = await sdk.dataContracts.getByIdentifier(dataContractIdentifier)
```

#### Create Data Contract

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
  PlatformVersionWASM.PLATFORM_V1
)
```

#### Data Contract Create Transition

Create Data Contract Create Transition

```javascript
import { DataContractTransitionType } from 'dash-platform-sdk'

const dataContract = // ... created data contract
const identityContractNonce = BigInt(1)

const transition = await sdk.dataContracts.createStateTransition(
  dataContract, 
  DataContractTransitionType.Create, 
  identityContractNonce
)
```

#### Data Contract Update Transition

Create Data Contract Update Transition

```javascript
import { DataContractTransitionType } from 'dash-platform-sdk'

const dataContract = // ... existing data contract with updates
const identityContractNonce = BigInt(2)

const transition = await sdk.dataContracts.createStateTransition(
  dataContract, 
  DataContractTransitionType.Update, 
  identityContractNonce
)
```

###  Documents

#### Create Document
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

#### Query Documents

Performs a query for documents and returns an array of DocumentWASM instances
```javascript
const dataContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const documentType = 'domain'
const limit = 100
const where =  [['$ownerId', '==', ownerId]]
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

### Document State Transitions
#### Create Document State Transitions

This method allows creation of various document state transitions using BatchType enum

```javascript
import { BatchType } from 'dash-platform-sdk'

const document = // ... created or fetched document
const identityContractNonce = BigInt(1)

// Create transition
const createTransition = await sdk.documents.createStateTransition(
  document, 
  BatchType.Create, 
  identityContractNonce
)

// Replace transition
const replaceTransition = await sdk.documents.createStateTransition(
  document, 
  BatchType.Replace, 
  identityContractNonce
)

// Delete transition
const deleteTransition = await sdk.documents.createStateTransition(
  document, 
  BatchType.Delete, 
  identityContractNonce
)

// Purchase transition (requires price parameter)
const purchaseTransition = await sdk.documents.createStateTransition(
  document, 
  BatchType.Purchase, 
  identityContractNonce,
  { price: BigInt(100) }
)

// Transfer transition (requires recipient parameter)
const transferTransition = await sdk.documents.createStateTransition(
  document, 
  BatchType.Transfer, 
  identityContractNonce,
  { recipient: '8VSMojGcwpFHeWnAZzYxJipFt1t3mb34BWtHt8csizQS' }
)

// Update price transition (requires price parameter)
const updatePriceTransition = await sdk.documents.createStateTransition(
  document, 
  BatchType.UpdatePrice, 
  identityContractNonce,
  { price: BigInt(200) }
)
```

### Identities
#### Get identity by identifier
Searches an identity by identifier (base58) and returns an IdentityWASM instance
```javascript
const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

const identity = await sdk.identities.getIdentityByIdentifier(identifier)

console.log(identity)
```

#### Get identity by public key hash
```javascript
const publicKeyHash = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef'

const identity = await sdk.identities.getIdentityByPublicKeyHash(publicKeyHash)

console.log(identity)
```

#### Get identity balance
Returns the current balance in credits for a given Identity

```javascript
const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

const balance = await sdk.identities.getIdentityBalance(identifier)

console.log(balance) // BigInt value in credits
```

#### Get identity nonce
Returns a current BigInt identity nonce for a given Identity

```javascript
const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

const identityNonce = await sdk.identities.getIdentityNonce(identifier)

console.log(identityNonce)
```

#### Get identity contract nonce
Returns a current BigInt identity contract nonce for a given Identity and Data Contract

```javascript
const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'
const dataContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

const identityContractNonce = await sdk.identities.getIdentityContractNonce(identifier, dataContractId)

console.log(identityContractNonce)
```

#### Get identity public keys
Return an array of IdentityPublicKeyWASM for a given identity if found

```javascript
const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

const identityPublicKeys = await sdk.identities.getIdentityPublicKeys(identifier)

console.log(identityPublicKeys)
```

### State Transition
#### Broadcast state transition

Broadcasts your state transition in the Dash Platform network
```javascript
const stateTransition = // ... created state transition

await sdk.stateTransitions.broadcast(stateTransition)
```

#### Wait for state transition result
Waits for an execution of a state transition in the network

```javascript
const stateTransition = // ... created state transition

await sdk.stateTransitions.waitForStateTransitionResult(stateTransition)
```

### DPNS Names
#### Search domain by name (ex. xyz.dash)
```javascript
const [document] = await sdk.names.search('xyz.dash')

console.log(document)
```

### Node Status
#### Returns status of the node and protocol info
```javascript
const status = await sdk.node.status()

console.log(status.chain.latestBlockHash)
console.log(status.time.epoch)
```

### Key Pairs
#### Mnemonic to identity key
Returns key of identity for mnemonic by identity index and key index
```javascript
const key = await sdk.keyPair.mnemonicToIdentityKey('*mnemonic*', 0, 0)

console.log(key.privateKey)
console.log(key.publicKey)
```

#### Derive child key
Derives a child key from a parent HD key
```javascript
const parentKey = // ... HD key
const childIndex = 0
const hardened = true

const childKey = await sdk.keyPair.deriveChild(parentKey, childIndex, hardened)
```

#### Derive path
Derives a key from an HD key using a derivation path
```javascript
const parentKey = // ... HD key
const path = "m/44'/5'/0'/0/0"

const derivedKey = await sdk.keyPair.derivePath(parentKey, path)
```

#### Key to wallet ID
Converts an HD key to a wallet ID
```javascript
const hdKey = // ... HD key

const walletId = await sdk.keyPair.keyToWalletId(hdKey)
```

#### Key to X private key
Converts an HD key to an extended private key string
```javascript
const hdKey = // ... HD key
const opts = { version: 'testnet' } // optional

const xPrivKey = await sdk.keyPair.keyToXPrivateKey(hdKey, opts)
```

#### Key to X public key
Converts an HD key to an extended public key bytes
```javascript
const hdKey = // ... HD key
const opts = { version: 'testnet' } // optional

const xPubKey = await sdk.keyPair.keyToXPublicKey(hdKey, opts)
```

#### Mnemonic to seed
Converts a mnemonic phrase to a seed
```javascript
const mnemonic = '*mnemonic phrase*'
const salt = 'optional salt' // optional
const verify = true // optional, verify mnemonic validity

const seed = await sdk.keyPair.mnemonicToSeed(mnemonic, salt, verify)
```

#### Mnemonic to wallet
Creates an HD wallet from a mnemonic phrase
```javascript
const mnemonic = '*mnemonic phrase*'
const salt = 'optional salt' // optional
const verify = true // optional
const opts = { versions: 'testnet' } // optional

const wallet = await sdk.keyPair.mnemonicToWallet(mnemonic, salt, verify, opts)
```

#### Private key to WIF
Converts a private key to Wallet Import Format
```javascript
const privateKeyBytes = // ... Uint8Array private key
const opts = { version: 'testnet' } // optional

const wif = await sdk.keyPair.privateKeyToWif(privateKeyBytes, opts)
```

#### Public key to address
Converts a public key to an address
```javascript
const publicKeyBytes = // ... Uint8Array public key
const opts = { version: 'testnet' } // optional

const address = await sdk.keyPair.publicKeyToAddress(publicKeyBytes, opts)
```

#### Seed to wallet
Creates an HD wallet from a seed
```javascript
const seed = // ... Uint8Array seed
const opts = { versions: 'testnet' } // optional

const wallet = await sdk.keyPair.seedToWallet(seed, opts)
```

#### Wallet to identity key
Derives an identity key from a wallet
```javascript
const wallet = // ... HD wallet or HD key
const identityIndex = 0
const keyIndex = 0
const opts = { network: 'testnet' } // optional

const identityKey = await sdk.keyPair.walletToIdentityKey(wallet, identityIndex, keyIndex, opts)
```

#### X key to HD X key
Converts an extended key string to an HD extended key
```javascript
const xKey = 'xprv...' // or 'xpub...'
const opts = {} // optional

const hdxKey = await sdk.keyPair.xKeyToHDXKey(xKey, opts)
```

### Utils
#### Base58 encoding/decoding
```javascript
// Base58 to bytes
const base58String = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const bytes = sdk.utils.base58ToBytes(base58String)

// Bytes to Base58
const base58 = sdk.utils.bytesToBase58(bytes)
```

#### Hex encoding/decoding
```javascript
// Hex to bytes
const hexString = 'deadbeef'
const bytes = sdk.utils.hexToBytes(hexString)

// Bytes to hex
const hex = sdk.utils.bytesToHex(bytes)
```

#### Convert to homograph safe chars
Converts a string to homograph-safe characters for DPNS names
```javascript
const unsafeString = 'exαmple'
const safeString = sdk.utils.convertToHomographSafeChars(unsafeString)
```

#### Get evonode list
Fetches the current list of evonodes for the network
```javascript
const network = 'testnet' // or 'mainnet'
const evonodes = await sdk.utils.getEvonodeList(network)

console.log(evonodes)
```

#### Get random array item
Returns a random item from an array
```javascript
const array = [1, 2, 3, 4, 5]
const randomItem = sdk.utils.getRandomArrayItem(array)
```

### Signer (Advanced)
The SDK supports custom signers for transaction signing. A signer must implement the AbstractSigner interface:

```javascript
interface AbstractSigner {
  connect(): Promise<AppConnectInfo>
  signAndBroadcast(stateTransition: StateTransitionWASM): Promise<StateTransitionWASM>
}

interface AppConnectInfo {
  identities: string[]
  currentIdentity: string | null
}
```

Example of using a custom signer:
```javascript
import { PrivateKeySigner } from 'dash-platform-sdk'

// Create a signer with a private key
const signer = new PrivateKeySigner(privateKeyBytes)

// Connect the signer
const connectInfo = await signer.connect()

// Sign and broadcast a state transition
const signedTransition = await signer.signAndBroadcast(stateTransition)
```

## Types and Interfaces

The SDK exports several useful types and interfaces:

```javascript
import { 
  DashPlatformSDK,
  IdentifierLike,
  MasternodeList,
  MasternodeInfo,
  NodeStatus,
  DataContractConfig,
  AbstractSigner,
  AppConnectInfo,
  BatchType,
  DataContractTransitionType
} from 'dash-platform-sdk'
```

### IdentifierLike
Type that can be an IdentifierWASM, string, or array-like number sequence.

### DataContractConfig
Configuration object for data contracts:
```javascript
interface DataContractConfig {
  $format_version: string
  canBeDeleted: boolean
  readonly: boolean
  keepsHistory: boolean
  documentsKeepHistoryContractDefault: boolean
  documentsMutableContractDefault: boolean
  documentsCanBeDeletedContractDefault: boolean
  requiresIdentityEncryptionBoundedKey?: number | null
  requiresIdentityDecryptionBoundedKey?: number | null
}
```

### NodeStatus
Comprehensive node status information including version, chain, network, and time data.

## Error Handling

The SDK currently relies on a happy path and doesn't include comprehensive error handling. This will be improved in future versions. For now, wrap SDK calls in try-catch blocks:

```javascript
try {
  const identity = await sdk.identities.getIdentityByIdentifier('invalid-id')
} catch (error) {
  console.error('Failed to fetch identity:', error)
}
```
