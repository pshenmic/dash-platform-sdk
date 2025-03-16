# dash-platform-sdk

This is an experimental alternative SDK for Dash Platform chain to access basic actions.

#### Development is ongoing, breaking changes may be each release

Features implemented:

* getStatus (retrieve node status)
* getDocuments (without deserialization atm)

# How to use

`npm install git:pshenmic/dash-platform-sdk`


1) Import:
```javascript
// ES6 / EcmaScript
import DashPlatformSDK from 'dash-platform-sdk'

// CommonJS
const DashPlatformSDK = require('dash-platform-sdk')
```

2) Run:
```javascript
const sdk = new DashPlatformSDK() // new DashPlatformSDK({ network: 'testnet', dapiUrls: ['https://52.33.28.47:1443']}) 

// Retrieve node status
const status = await sdk.utils.getStatus()

console.log(status)

// Get Documents
const documents = await sdk.documents.get('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', 'domain')

console.log(documents)
```
