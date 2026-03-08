# State Transitions

## Broadcast

Broadcasts a signed state transition to the Dash Platform network

```javascript
const stateTransition = // ... created and signed state transition

await sdk.stateTransitions.broadcast(stateTransition)
```

## Wait for State Transition Result

Waits for a state transition to finalize in the network (usually 1-3 seconds) and verifies the cryptographic proof

```javascript
const stateTransition = // ... created and signed state transition

await sdk.stateTransitions.waitForStateTransitionResult(stateTransition)
```
