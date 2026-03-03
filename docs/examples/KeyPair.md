# Key Pair

Functions for working with BIP32/BIP39 HD keys and Dash addresses

## Mnemonic to Seed

```javascript
const mnemonic = 'word1 word2 word3 ...'
const seed = sdk.keyPair.mnemonicToSeed(mnemonic)
```

## Seed to HD Key

```javascript
const hdKey = sdk.keyPair.seedToHdKey(seed, 'testnet')
```

## Derive Identity Private Key

Derives an identity private key from an HD key using the standard Dash Platform derivation path
`m/9'/{networkIndex}'/5'/0'/0'/{identityIndex}'/{keyIndex}'`

```javascript
const identityIndex = 0
const keyIndex = 0

const childKey = sdk.keyPair.deriveIdentityPrivateKey(hdKey, identityIndex, keyIndex, 'testnet')

const privateKeyBytes = childKey.privateKey
```

## Derive Child Key

```javascript
const childKey = await sdk.keyPair.deriveChild(hdKey, 0)
```

## Derive Key by Path

```javascript
const childKey = await sdk.keyPair.derivePath(hdKey, "m/9'/5'/5'/0'/0'/0'/0'")
```

## P2PKH Address

Converts a public key to a Dash network address

```javascript
const address = sdk.keyPair.p2pkhAddress(publicKeyBytes, 'testnet')

console.log(address) // e.g. yjHVQ3dj37UJwXFmvMTKR9ZVfoJSc3opTD
```
