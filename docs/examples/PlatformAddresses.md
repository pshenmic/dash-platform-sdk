# Platform Addresses

Platform addresses hold credits directly on Platform (without an Identity). The SDK exposes read
queries for address balance/nonce and a `createStateTransition` builder for all six Platform
Address transitions.

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

## Create State Transition

`createStateTransition(type, params)` assembles a `StateTransitionWASM` for any of the six Platform
Address transitions. `type` is one of `identityCreditTransferToAddresses`,
`identityCreateFromAddresses`, `identityTopUpFromAddresses`, `addressFundsTransfer`,
`addressFundingFromAssetLock`, `addressCreditWithdrawal`. The builder is generic over the transition
type (`PlatformAddressTransitionParamsMap`), so in TypeScript each type only accepts its own params.
Pass the constructor params directly (already-built entities).

### Transfer credits from an Identity to addresses (`identityCreditTransferToAddresses`)

Signed by the Identity key after construction, so no `inputWitness` is required.

```javascript
const identityId = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'
const nonce = await sdk.identities.getIdentityNonce(identityId)

const stateTransition = sdk.platformAddresses.createStateTransition('identityCreditTransferToAddresses', {
  identityId,
  recipients: outputs,
  nonce
})

stateTransition.sign(privateKey, identityPublicKey)

await sdk.stateTransitions.broadcast(stateTransition)
await sdk.stateTransitions.waitForStateTransitionResult(stateTransition)
```

### Create a new Identity from addresses (`identityCreateFromAddresses`)

```javascript
const stateTransition = sdk.platformAddresses.createStateTransition('identityCreateFromAddresses', {
  publicKeys,
  inputs,
  feeStrategy,
  inputWitness
})

await sdk.stateTransitions.broadcast(stateTransition)
```

### Top up an existing Identity from addresses (`identityTopUpFromAddresses`)

```javascript
const stateTransition = sdk.platformAddresses.createStateTransition('identityTopUpFromAddresses', {
  identityId: 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv',
  inputs,
  feeStrategy,
  inputWitness
})

await sdk.stateTransitions.broadcast(stateTransition)
```

### Transfer credits between addresses (`addressFundsTransfer`)

```javascript
const stateTransition = sdk.platformAddresses.createStateTransition('addressFundsTransfer', {
  inputs,
  feeStrategy,
  inputWitness,
  outputs
})

await sdk.stateTransitions.broadcast(stateTransition)
```

### Fund addresses from a Core asset lock (`addressFundingFromAssetLock`)

The recipient outputs may omit credits (`OutputAddressNullableCreditsWASM`).

```javascript
const outputs = [new OutputAddressNullableCreditsWASM(recipient)]

const stateTransition = sdk.platformAddresses.createStateTransition('addressFundingFromAssetLock', {
  assetLockProof,
  inputs,
  feeStrategy,
  inputWitness,
  outputs
})

await sdk.stateTransitions.broadcast(stateTransition)
```

### Withdraw from addresses to a Core (L1) address (`addressCreditWithdrawal`)

Build the `outputScript` from a Core address with `CoreScriptWASM.newP2PKH`.

```javascript
import { CoreScriptWASM } from 'dash-platform-sdk'
import { base58 } from '@scure/base'

const outputScript = CoreScriptWASM.newP2PKH(base58.decode('yjHVQ3dj37UJwXFmvMTKR9ZVfoJSc3opTD').slice(1, 21))

const stateTransition = sdk.platformAddresses.createStateTransition('addressCreditWithdrawal', {
  inputs,
  feeStrategy,
  coreFeePerByte: 1, // Core (L1) fee rate in duffs/byte - use a network fee estimate, not a fixed value
  pooling: 'Standard', // withdrawal pooling policy: 'Standard' | 'Never' | 'IfAvailable'
  outputScript,
  inputWitness
})

await sdk.stateTransitions.broadcast(stateTransition)
```

More detailed usage can be seen in `test/unit/PlatformAddress.spec.ts`.
