import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'

let sdk: DashPlatformSDK

describe('DashPlatformSDK', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet' })
  })

  test('should be constructable throw `new`', () => {
    expect(sdk).toEqual(expect.any(DashPlatformSDK))
  })

  test('should be able to deserialize consensus error', () => {
    const err = sdk.utils.deserializeConsensusError('AwIiSW52YWxpZCBTdGF0ZSBUcmFuc2l0aW9uIHNpZ25hdHVyZQ')

    expect(err).toEqual('Invalid State Transition signature')
  })
})
