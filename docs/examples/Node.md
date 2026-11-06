# Node

## Status

Returns status of the connected node including version, chain, network, and time info

```javascript
const status = await sdk.node.status()

console.log(status.chain.latestBlockHash)
console.log(status.chain.latestBlockHeight)
console.log(status.time.epoch)
console.log(status.version.software.dapi)
```

## Total Credits

Returns the total amount of credits locked in the Dash Platform state as a BigInt

```javascript
const totalCredits = await sdk.node.totalCredits()

console.log(totalCredits)
```

## Epochs Info

Returns an array of epoch information including block heights, start times, and fee multipliers

```javascript
const count = 10
const ascending = true
const start = 0 // optional starting epoch number

const epochs = await sdk.node.getEpochsInfo(count, ascending, start)

epochs.forEach(epoch => {
  console.log(epoch.number)
  console.log(epoch.firstBlockHeight)
  console.log(epoch.firstCoreBlockHeight)
  console.log(epoch.startTime)      // BigInt ms timestamp
  console.log(epoch.feeMultiplier)  // BigInt permille
})
```

## Path Elements

Returns GroveDB elements stored under the given keys of a path in the platform state, in key order.
Keys with nothing stored under them are omitted (their absence is still proven). Always requested with proof, even if proofs are disabled

```javascript
const path = [new Uint8Array([96])] // path segments of the subtree (identity balances)
const keys = [sdk.utils.base58ToBytes('QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv')] // keys of the elements in the subtree

const elements = await sdk.node.getPathElements(path, keys)

elements.forEach(({ key, element }) => {
  console.log(key) // Uint8Array
  console.log(element?.type) // e.g. 'SumItem', 'Item', 'SumTree'
  console.log(element?.value) // item payload or subtree root key
  console.log(element?.sum, element?.count) // bigint, for sum / count bearing elements
})
```
