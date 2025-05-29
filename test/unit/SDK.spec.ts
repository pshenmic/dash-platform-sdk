import { DashPlatformSDK } from '../../src/index'

let sdk: DashPlatformSDK

describe('DashPlatformSDK', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
  })

  test('should be constructable throw `new`', () => {
    expect(sdk).toEqual(expect.any(DashPlatformSDK))
  })
})
