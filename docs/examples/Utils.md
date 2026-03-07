# Utils

## Base58 Encoding/Decoding

```javascript
// Base58 to bytes
const base58String = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const bytes = sdk.utils.base58ToBytes(base58String)

// Bytes to Base58
const base58 = sdk.utils.bytesToBase58(bytes)
```

## Hex Encoding/Decoding

```javascript
// Hex to bytes
const hexString = 'deadbeef'
const bytes = sdk.utils.hexToBytes(hexString)

// Bytes to hex
const hex = sdk.utils.bytesToHex(bytes)
```

## Convert to Homograph Safe Chars

Converts a string to homograph-safe characters for DPNS names

```javascript
const str = 'alice'
const normalizedString = sdk.utils.convertToHomographSafeChars(str) // al1ce
```

## Create Voter Identity Identifier

Derives the voter identity identifier from a masternode's pro tx hash and voting address public key hash

```javascript
const proTxHash = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'
const publicKeyHash = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef'

const voterIdentifier = await sdk.utils.createVoterIdentifier(proTxHash, publicKeyHash)

console.log(voterIdentifier.toString())
```

## Create Masternode Identity Identifier

Derives the masternode identity identifier from a pro tx hash

```javascript
const proTxHash = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'

const masternodeIdentifier = sdk.utils.createMasternodeIdentifier(proTxHash)

console.log(masternodeIdentifier.toString())
```

## Validate Identifier

Returns `true` if the given value is a valid Dash Platform identifier (base58 string, hex string, or 32-byte Uint8Array)

```javascript
const isValid = sdk.utils.validateIdentifier('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')

console.log(isValid) // true
```
