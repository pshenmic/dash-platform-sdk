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
