import { IdentifierWASM, StateTransitionWASM, VoteWASM } from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'

const POLL_ID = '4vJ9JU1bJJE96FWSJKvHsmmFADCg4gpZQff4P3bkLKi'
const PRO_TX_HASH = 'd9b090cfc19caf2e27d512e69c43812a274bdf29c081d0ade4fd272ad56a5f89'
const VOTER_ID = 'HqfLeB9PLg3t9CL25tRNkEDPjAnDaHAMmthRNe8ucn8q'

let sdk: DashPlatformSDK

describe('Voting', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet' })
  })

  test('should be able to create a yes/no vote', () => {
    const vote = sdk.voting.createYesNoVote(POLL_ID, 'yes')

    expect(vote).toEqual(expect.any(VoteWASM))
    expect(vote.pollId.base58()).toEqual(POLL_ID)
    expect(vote.yesNoChoice).toEqual('yes')
  })

  test('should be able to create a yes/no vote state transition', () => {
    const vote = sdk.voting.createYesNoVote(POLL_ID, 'abstain')
    const stateTransition = sdk.voting.createStateTransition(vote, PRO_TX_HASH, new IdentifierWASM(VOTER_ID), BigInt(1))

    expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
  })
})
