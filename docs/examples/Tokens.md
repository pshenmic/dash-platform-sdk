# Tokens

## Get Identity Token Balances

Retrieves token balances for a list of identities

```javascript
const identifiers = [
  'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR',
  '8GopLQQCViyroS2gHktesGaCMe2tueXWeQ6Y9vpMFTEC'
]
const tokenIdentifier = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'

const balances = await sdk.tokens.getIdentitiesTokenBalances(identifiers, tokenIdentifier)

console.log(balances)
```

## Get Identity Tokens Balances

Retrieves balances for multiple tokens for a single identity

```javascript
const identifier = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'
const tokenIdentifiers = [
  '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
]

const balances = await sdk.tokens.getIdentityTokensBalances(identifier, tokenIdentifiers)

console.log(balances)
```

## Get Token Contract Info

Retrieves contract information for a token including its data contract id and position

```javascript
const tokenIdentifier = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'

const info = await sdk.tokens.getTokenContractInfo(tokenIdentifier)

console.log(info.dataContractId)
console.log(info.tokenContractPosition)
```

## Get Token Total Supply

Retrieves the total supply of a token

```javascript
const tokenIdentifier = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'

const supply = await sdk.tokens.getTokenTotalSupply(tokenIdentifier)

console.log(supply.totalSystemAmount)
console.log(supply.totalAggregatedAmountInUserAccounts)
```

## Get Token Direct Purchase Prices

Retrieves the direct purchase prices for a list of tokens

```javascript
const tokenIdentifiers = ['6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C']

const prices = await sdk.tokens.getTokensDirectPurchasePrice(tokenIdentifiers)

console.log(prices)
```

## Transfer Token

Transfer a token to another identity

```javascript
const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'
const recipient = '8GopLQQCViyroS2gHktesGaCMe2tueXWeQ6Y9vpMFTEC'
const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
const amount = BigInt(10000)

const privateKey = PrivateKeyWASM.fromHex('deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', 'testnet')
const publicKeyId = 5

const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)
const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'transfer', { identityId: recipient, amount })

stateTransition.signByPrivateKey(privateKey, 'ECDSA_SECP256K1')
stateTransition.signaturePublicKeyId = publicKeyId

await sdk.stateTransitions.broadcast(stateTransition)
```

## Token State Transitions

The `createStateTransition` method supports the following token transition types:
`burn` | `mint` | `transfer` | `freeze` | `unfreeze` | `destroyFrozenFunds` | `emergencyAction` | `directPurchase` | `setPriceForDirectPurchase`

```javascript
const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, ownerId)

const stateTransition = sdk.tokens.createStateTransition(
  tokenBaseTransition,
  ownerId,
  'mint', // transition type
  { amount: BigInt(1000) }
)
```
