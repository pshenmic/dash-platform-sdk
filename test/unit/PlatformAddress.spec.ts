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

  test('getAddressesInfos', async () => {
    const addresses = [
      'tdashevo1qpgz9hk6tkn5zj3653s8qkjmk9439qkf0gl4yxxw',
      'tdashevo1qq79z66rh34l4u2axlz3jv34zwshggnenut9k093',
      'tdashevo1qpwyg4khd0rh8px5cjphv9wx38psl6hma5krg9gk'
    ]
    const info = await sdk.platformAddresses.getAddressesInfos(addresses)

    expect(info).toHaveLength(addresses.length)
  })
})
