# DPNS Names

## Search by Name

Search for a registered DPNS name. Returns an array of matching `domain` documents.

```javascript
const [document] = await sdk.names.searchByName('alice.dash')

console.log(document)
```

## Search by Identity

Returns all DPNS domain documents owned by a given identity

```javascript
const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

const documents = await sdk.names.searchByIdentity(identifier)

console.log(documents)
```

## Register Name

Performs the full DPNS name registration sequence (preorder + domain document).
Contested names (≤19 chars matching the DPNS pattern) include an additional 0.2 DASH masternode vote fee — check with `testNameContested` first.

```javascript
const privateKey = PrivateKeyWASM.fromHex('deadbeef...', 'testnet')

await sdk.names.registerName('alice.dash', identityId, privateKey)
```

## Test if Name is Contested

Returns `true` if the given username falls under contested name rules

```javascript
const isContested = sdk.names.testNameContested('alice.dash')

console.log(isContested) // true or false
```

## Validate Name

Returns `null` if the name is valid, or a string describing the reason it is invalid

```javascript
const error = sdk.names.validateName('alice.dash')

if (error != null) {
  console.error('Invalid name:', error)
}
```

## Normalize Label

Converts a DPNS label to homograph-safe normalized form (e.g. `alice` → `al1ce`)

```javascript
const normalized = sdk.names.normalizeLabel('alice')

console.log(normalized) // al1ce
```
