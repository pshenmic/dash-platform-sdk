# Platform Addresses

Platform addresses hold credits directly on Platform (without an Identity). The SDK exposes read
queries for address balance/nonce, a low-level `createStateTransition` builder for all six Platform
Address transitions, and convenience builders on top of it.

> **Signing.** Address-funded transitions carry their signature material as constructor input via
> `inputWitness: AddressWitnessWASM[]`. Witnesses are produced by the client application (wallet,
> mobile app or browser extension) where the address private keys live - the SDK builders never sign
> and never hit the network. Build the witnesses with `AddressWitnessWASM.P2PKH(signature)` /
> `AddressWitnessWASM.P2SH(signatures, redeemScript)` and pass them in.

## Get Address Info

Returns an object with `address`, `balance` and `nonce` for a Platform address.

```javascript
const info = await sdk.platformAddresses.getAddressInfo('tdash1kzg5azscav69z7m6dfzr9ner0a5vt7pn9ca4sz8d')

console.log(info.balance, info.nonce)
```

## Get Addresses Infos

Same as above for a batch of addresses.

```javascript
const infos = await sdk.platformAddresses.getAddressesInfos([
  'tdash1kzg5azscav69z7m6dfzr9ner0a5vt7pn9ca4sz8d',
  'tdash1kqr3cxhgel75ru0yrhj5eq8j8jt92m5enqrfajxw'
])

console.log(infos)
```

## Building the params

The entity classes used below are re-exported from the SDK, so you don't need to import
`pshenmic-dpp` directly:

```javascript
import {
  InputAddressWASM,
  OutputAddressWASM,
  OutputAddressNullableCreditsWASM,
  AddressFundsFeeStrategyStepWASM,
  AddressWitnessWASM
} from 'dash-platform-sdk'

const sender = 'tdash1kzg5azscav69z7m6dfzr9ner0a5vt7pn9ca4sz8d'
const recipient = 'tdash1kqr3cxhgel75ru0yrhj5eq8j8jt92m5enqrfajxw'

// inputs spent from Platform addresses (nonce from getAddressInfo)
const inputs = [new InputAddressWASM(sender, 0, 100000n)]
// where the credits go
const outputs = [new OutputAddressWASM(recipient, 50000n)]
// how fees are deducted
const feeStrategy = [AddressFundsFeeStrategyStepWASM.DeductFromInput(1)]
// signatures over the inputs, produced by the client app holding the keys
const inputWitness = [AddressWitnessWASM.P2PKH(signature)]
```

## Convenience builders

### Transfer To Address (Identity → addresses)

Transfer credits from an Identity to one or more Platform addresses. Signed by the Identity key
after construction, so no `inputWitness` is required.

```javascript
const identityId = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'
const nonce = await sdk.identities.getIdentityNonce(identityId)

const stateTransition = sdk.platformAddresses.transferToAddress({
  identityId,
  recipient,
  amount: 50000n,
  nonce
})

stateTransition.sign(privateKey, identityPublicKey)

await sdk.stateTransitions.broadcast(stateTransition)
await sdk.stateTransitions.waitForStateTransitionResult(stateTransition)
```

### Create Identity From Addresses

Create a new Identity funded from Platform addresses.

```javascript
const stateTransition = sdk.platformAddresses.createIdentityFromAddresses({
  publicKeys,
  inputs,
  feeStrategy,
  inputWitness
})

await sdk.stateTransitions.broadcast(stateTransition)
```

### Top Up Identity From Addresses

Top up an existing Identity from Platform addresses.

```javascript
const stateTransition = sdk.platformAddresses.topUpFromAddresses({
  identityId: 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv',
  inputs,
  feeStrategy,
  inputWitness
})

await sdk.stateTransitions.broadcast(stateTransition)
```

### Transfer Between Addresses

Transfer credits from one set of Platform addresses to another.

```javascript
const stateTransition = sdk.platformAddresses.transferBetweenAddresses({
  inputs,
  feeStrategy,
  inputWitness,
  outputs
})

await sdk.stateTransitions.broadcast(stateTransition)
```

### Fund From Asset Lock

Fund Platform addresses from a Core asset lock proof. The recipient outputs may omit credits
(`OutputAddressNullableCreditsWASM`).

```javascript
const outputs = [new OutputAddressNullableCreditsWASM(recipient)]

const stateTransition = sdk.platformAddresses.fundFromAssetLock({
  assetLockProof,
  inputs,
  feeStrategy,
  inputWitness,
  outputs
})

await sdk.stateTransitions.broadcast(stateTransition)
```

### Withdrawal To Core

Withdraw from Platform addresses to a Core (L1) address. Pass a `coreAddress` (converted to a P2PKH
output script for you) or an explicit `outputScript`. `coreFeePerByte` defaults to `1` and `pooling`
to `'Standard'`.

```javascript
const stateTransition = sdk.platformAddresses.withdrawalToCore({
  inputs,
  feeStrategy,
  inputWitness,
  coreAddress: 'yjHVQ3dj37UJwXFmvMTKR9ZVfoJSc3opTD'
})

await sdk.stateTransitions.broadcast(stateTransition)
```

## Low-level: Create State Transition

`createStateTransition(type, params)` is the low-level builder the convenience methods delegate to.
`type` is one of `identityCreditTransferToAddresses`, `identityCreateFromAddresses`,
`identityTopUpFromAddresses`, `addressFundsTransfer`, `addressFundingFromAssetLock`,
`addressCreditWithdrawal`. Pass the constructor params directly (already-built entities):

```javascript
const stateTransition = sdk.platformAddresses.createStateTransition('addressFundsTransfer', {
  inputs,
  feeStrategy,
  inputWitness,
  outputs
})

await sdk.stateTransitions.broadcast(stateTransition)
```

More detailed usage can be seen in `test/unit/PlatformAddress.spec.ts`.
