import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'

let sdk: DashPlatformSDK

describe('PlatformAddress', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet' })
  })

  test('getAddressInfo', async () => {
    const info = await sdk.platformAddresses.getAddressInfo('tdash1kzg5azscav69z7m6dfzr9ner0a5vt7pn9ca4sz8d')

    expect(info.balance).toBeDefined()
    expect(info.nonce).toBeDefined()
    expect(info.address).toBeDefined()
  })

  test('getAddressesInfos', async () => {
    const addresses = [
      'tdash1kzg5azscav69z7m6dfzr9ner0a5vt7pn9ca4sz8d',
      'tdash1kqr3cxhgel75ru0yrhj5eq8j8jt92m5enqrfajxw',
      'tdash1kq9plfyacx9q26dtaxgwuw9lt78nyu2mzc3xwcxv'
    ]
    const info = await sdk.platformAddresses.getAddressesInfos(addresses)

    expect(info).toHaveLength(addresses.length)
  })
})
