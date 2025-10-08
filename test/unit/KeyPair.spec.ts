import { DashPlatformSDK } from "../../src/DashPlatformSDK.js";

let sdk: DashPlatformSDK
let mnemonic: string

describe('KeyPair', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet' })
    mnemonic = 'deliver frame tomato ring tool second dream mutual fade sponsor visa teach'
  })

  describe('mnemonic', () => {
    test('should be able to get seed from mnemonic', async () => {
      const seed = sdk.keyPair.mnemonicToSeed(mnemonic)

      // TODO: Get mock data from sdk
      expect(seed).toEqual(Uint8Array.from([170, 120, 192, 223, 47, 43, 142, 250, 243, 136, 44, 236, 84, 170, 156, 154, 126, 231, 185, 130, 242, 40, 134, 27, 36, 33, 187, 102, 29, 177, 119, 141, 61, 157, 81, 35, 85, 33, 43, 28, 108, 24, 108, 159, 119, 233, 104, 100, 2, 206, 18, 245, 142, 99, 19, 143, 141, 0, 207, 31, 143, 58, 245, 107]))
    })

    test('should be able to derive hd wallet from seed', async () => {
      const seed = sdk.keyPair.mnemonicToSeed(mnemonic)
      const hdKey = sdk.keyPair.seedToHdKey(seed)

      expect(hdKey.privateKey).toEqual(new Uint8Array([105, 213, 35, 36, 214, 9, 104, 32, 148, 57, 157, 10, 134, 251, 79, 152, 252, 58, 194, 48, 145, 102, 7, 252, 191, 69, 164, 97, 195, 136, 182, 93]))
    })

    test('should be able to derive address from wallet via derive path', async () => {
      const seed = sdk.keyPair.mnemonicToSeed(mnemonic)
      const seedHdKey = sdk.keyPair.seedToHdKey(seed, 'testnet')

      const derivedHdKey = await sdk.keyPair.derivePath(seedHdKey, "m/44'/1'/0'/0/0")

      const address = sdk.keyPair.p2pkhAddress(derivedHdKey.publicKey as Uint8Array, 'testnet')

      expect(address).toEqual('yRGEqFgmuqJct4jzH48sFrvBCc3WuPKDTp')
    })

    test('should be able to derive identity hd key from wallet', async () => {
      const seed = sdk.keyPair.mnemonicToSeed(mnemonic)
      const seedHdKey = sdk.keyPair.seedToHdKey(seed)

      const key = sdk.keyPair.deriveIdentityPrivateKey(seedHdKey, 0, 0, 'testnet')

      expect(key.privateKey).toEqual(Uint8Array.from([89, 255, 64, 41, 202, 170, 83, 68, 135, 58, 161, 107, 130, 20, 3, 50, 69, 16, 108, 104, 32, 68, 13, 100, 225, 24, 79, 20, 193, 184, 238, 55]))
    })
  })
})
