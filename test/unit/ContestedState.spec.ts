import {DashPlatformSDK} from "../../src";
import {IdentifierLike} from "../../src/types";

let sdk: DashPlatformSDK
let contractId: IdentifierLike

describe('Node', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()

    contractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
  })

  test("should be able to get contested resource vote state", async () => {
    const voteState = await sdk.contestedState.getContestedResourceVoteState(
      contractId,
      'domain',
        'parentNameAndLabel',

    )
  })
})