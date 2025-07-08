import { DashPlatformSDK } from '../../src'
import { ContestedStateResultType, IdentifierLike } from '../../src/types'

let sdk: DashPlatformSDK
let contractId: IdentifierLike

describe('Contested State', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()

    contractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
  })

  test('should be able to get contested resource vote state with finishedVoteInfo', async () => {
    const voteState = await sdk.contestedState.getContestedResourceVoteState(
      contractId,
      'domain',
      'parentNameAndLabel',
      [
        'dash',
        'test000'
      ],
      ContestedStateResultType.DOCUMENTS_AND_VOTE_TALLY,
      false
    )

    expect(voteState.finishedVoteInfo).toBeTruthy()
    expect(voteState.contenders).toBeTruthy()
    expect(voteState.abstainVoteTally).toBeDefined()
    expect(voteState.lockVoteTally).toBeDefined()
  })

  test('should be able to get contested resource vote state for incorrect values', async () => {
    const voteState = await sdk.contestedState.getContestedResourceVoteState(
      contractId,
      'domain',
      'parentNameAndLabel',
      [
        'dash',
        'testo1111111110'
      ],
      ContestedStateResultType.DOCUMENTS_AND_VOTE_TALLY,
      false
    )

    expect(voteState.contenders).toBeTruthy()
    expect(voteState.finishedVoteInfo).not.toBeTruthy()
    expect(voteState.abstainVoteTally).not.toBeTruthy()
    expect(voteState.lockVoteTally).not.toBeTruthy()
  })
})
