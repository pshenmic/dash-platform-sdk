# dash-platform-sdk

This is an experimental alternative SDK for Dash Platform chain to access basic actions.


Features implemented:

* getStatus (retrieve node status)


# How to use

`npm install git:pshenmic/dash-platform-sdk`


EcmaScript:
```javascript
import DashPlatformSDK from 'dash-platform-sdk'

const sdk = new DashPlatformSDK()

// Retrieve node status
const status = await sdk.utils.getStatus()

console.log(status)
```

CommonJS:
```javascript
const DashPlatformSDK = require('dash-platform-sdk')


const sdk = new DashPlatformSDK()

// Retrieve node status
const status = await sdk.utils.getStatus()

console.log(status)
```
