# State Transitions

## Broadcast

Broadcasts a signed state transition to the Dash Platform network

```javascript
const stateTransition = // ... created and signed state transition

await sdk.stateTransitions.broadcast(stateTransition)
```

## Wait for State Transition Result

Waits for a state transition to finalize in the network (usually 1-3 seconds) and verifies the cryptographic proof.
Returns the owner's credit balance after the transition executed when the proof carries it (document and token batches, contract create and update, identity update), otherwise `undefined`

```javascript
const stateTransition = // ... created and signed state transition

const ownerBalance = await sdk.stateTransitions.waitForStateTransitionResult(stateTransition)

console.log(ownerBalance) // 1234567890n or undefined
```
