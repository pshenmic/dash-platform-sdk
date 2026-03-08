import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'

let sdk: DashPlatformSDK

describe('PlatformAddress', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet' })
  })

  test('getAddressInfo', async () => {
    const info = await sdk.platformAddresses.getAddressInfo('tdashevo1qpgz9hk6tkn5zj3653s8qkjmk9439qkf0gl4yxxw')

    expect(info.balance).toBeDefined()
    expect(info.nonce).toBeDefined()
    expect(info.address).toBeDefined()
  })
})
