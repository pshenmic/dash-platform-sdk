# dash-platform-sdk v1.0.5
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/pshenmic/dash-platform-sdk/blob/master/LICENSE) ![npm version](https://img.shields.io/npm/v/react.svg?style=flat) ![a](https://github.com/pshenmic/platform-explorer/actions/workflows/build.yml/badge.svg)


This is an experimental alternative lightweight SDK for Dash Platform chain that let you make queries, create, and sign state
transitions locally and broadcast them into network

It uses an alternative WASM bindings layer to a Dash Platform Protocol, and other GRPC Client solution, that allowed us to minimize the final build to around 3 megabytes

SDK uses a pre-defined set of seed nodes (public RPC) at the start, and then tries to switch to the latest list of nodes fetched from the Dash network through https://rpc.digitalcash.dev if possible

### This is development version, breaking changes may be each release

Currently, only minimal features are included, such as document querying and creation of the documents, and all necessary related functions to do that
There is no input validation and error handling implemented yet relying on a happy path, this is going to be fixed in next versions

**This package is not yet production and mainnet ready, and I would only recommend to use it in the testnet environment**

This library is isomorphic and works in both Node.js and Web browsers without polyfilling


## Install

```bash
$ npm install dash-platform-sdk
```

Alternatively, you could simply include the library from the CDN:

https://unpkg.com/dash-platform-sdk@1.0.4/dist/main.js

## Quickstart
To use the SDK, simply import the library and instantiate an instance of DashPlatformSDK:
```javascript
// ES6 / EcmaScript
import DashPlatformSDK from 'dash-platform-sdk'

// CommonJS
const DashPlatformSDK = require('dash-platform-sdk')

const sdk = new DashPlatformSDK({network: 'testnet'})
```

Or load it straight from the web page:

```html
<script src="https://unpkg.com/dash-platform-sdk@1.0.4/dist/main.js"></script>
<script>
    const sdk = new DashPlatformSDK({network: 'testnet'})
</script>
```


## API Documentation

###  Data Contracts

#### Get Data Contract By Identifier

Queries a DAPI for data contract and returns a IdentityWASM instance

```javascript
const dataContractIdentifier = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

const dataContract = await sdk.dataContracts.getByIdentifier(dataContractIdentifier)
```

###  Documents

#### Create Document
Creates a DocumentWASM instance that can be used for a state transition creation


```javascript
const dataContract = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const identity = '9VSMojGcwpFHeWnAZzYxJipFt1t3mb34BWtHt8csizQS'
const identityContractNonce = BigInt(1)
const documentType = 'domain'
const data = {
  "key": "value"
}

const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

console.log(document)
```

#### Query Document

Performs a query for a document and returns an instance of DocumentWASM
```javascript
const dataContract = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const ownerId = '7xnwhCsZQUAHA5ZTFhCxgwSdut4MoMb5GwnzepVrkiuq'
const documentType = 'domain'
const limit = 100
const where =  [['$ownerId', '==', ownerId]]
const orderBy = [['$createdAt', 'desc']]

// optional and one of
const startAt = base58.decode(ownerId)
const startAfter = base58.decode(ownerId)

const [document] = await sdk.documents.query(dataContract, documentType, where, orderBy, limit, startAt, startAfter)

console.log(document)
```

### Identities
#### Get identity by identifier
Searches an identity by identifier (base58) and returns an IdentityWASM instance
```javascript
const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'

const identity = await sdk.identities.getByIdentifier(identifier)

console.log(identity)
```

#### Get identity by public key hash
```javascript
const publicKeyHash = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef'

const identity = await sdk.identities.getByPublicKeyHash(publicKeyHash)

console.log(identity)
```

#### Get identity nonce
Returns a current BigInt identity nonce for a given Identity

```javascript
const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'

const idenityNonce = await sdk.identities.getIdentityNonce(identifier)

console.log(identityNonce)
```

#### Get identity contract nonce
Returns a current BigInt identity contract nonce for a given Identity and Data Contract

```javascript
const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'
const dataContract = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

const idenityContractNonce = await sdk.identities.idenityContractNonce(identifier, dataContract)

console.log(idenityContractNonce)
```

#### Get identity public keys
Return an array of IdentityPublicKeyWASM for a given identity if found

```javascript
const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'

const identityPublicKeys = await sdk.identities.getIdentityPublicKeys(identifier)

console.log(identityPublicKeys)
```

### State Transition
#### From Document
Creates a StateTransitionWASM instance that you can use to sign with your private key and later broadcast

```javascript
const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

const stateTransition = await sdk.stateTransitions.fromDocument(document, "CREATE", identityContractNonce)

console.log(stateTransition)
```

#### Broadcast state transition

Broadcasts your state transition in the Dash Platform network
```javascript
await sdk.stateTransitions.broadcastStateTransition(stateTransition)
```

#### Wait for state transition result
Waits for an execution of a state transition in the network

```javascript
const stateTransitionHash = hexToBytes('4B47EEA3E7621BCEDDD7531A153E01262391A8ECB3C3F93628E5DC3B791EBDFA')
await sdk.stateTransitions.broadcastStateTransition(stateTransitionHash)
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


