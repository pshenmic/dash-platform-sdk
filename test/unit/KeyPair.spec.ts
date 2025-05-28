import { DashPlatformSDK } from '../../src'

let sdk: DashPlatformSDK
let mnemonic: string

describe('KeyPair', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
    mnemonic = 'deliver frame tomato ring tool second dream mutual fade sponsor visa teach'
  })

  describe('mnemonic', () => {
    test('should be able to get seed from mnemonic', async () => {
      const seed = await sdk.keyPair.utils.mnemonicToSeed(mnemonic, '', true)

      // TODO: Get mock data from sdk
      expect(seed).toEqual(Uint8Array.from([170, 120, 192, 223, 47, 43, 142, 250, 243, 136, 44, 236, 84, 170, 156, 154, 126, 231, 185, 130, 242, 40, 134, 27, 36, 33, 187, 102, 29, 177, 119, 141, 61, 157, 81, 35, 85, 33, 43, 28, 108, 24, 108, 159, 119, 233, 104, 100, 2, 206, 18, 245, 142, 99, 19, 143, 141, 0, 207, 31, 143, 58, 245, 107]))
    })

    test('should be able to get wallet from seed', async () => {
      const seed = Uint8Array.from([170, 120, 192, 223, 47, 43, 142, 250, 243, 136, 44, 236, 84, 170, 156, 154, 126, 231, 185, 130, 242, 40, 134, 27, 36, 33, 187, 102, 29, 177, 119, 141, 61, 157, 81, 35, 85, 33, 43, 28, 108, 24, 108, 159, 119, 233, 104, 100, 2, 206, 18, 245, 142, 99, 19, 143, 141, 0, 207, 31, 143, 58, 245, 107])

      const wallet = await sdk.keyPair.utils.seedToWallet(seed, { versions: 'testnet' })

      expect(wallet.privateKey).toEqual(new Uint8Array([105, 213, 35, 36, 214, 9, 104, 32, 148, 57, 157, 10, 134, 251, 79, 152, 252, 58, 194, 48, 145, 102, 7, 252, 191, 69, 164, 97, 195, 136, 182, 93]))
    })

    test('should be able to get wallet from mnemonic', async () => {
      const wallet = await sdk.keyPair.utils.mnemonicToWallet(mnemonic, '', true, { versions: 'testnet' })

      expect(wallet.privateKey).toEqual(new Uint8Array([105, 213, 35, 36, 214, 9, 104, 32, 148, 57, 157, 10, 134, 251, 79, 152, 252, 58, 194, 48, 145, 102, 7, 252, 191, 69, 164, 97, 195, 136, 182, 93]))
    })

    test('should be able to get wallet for testnet from mnemonic without options', async () => {
      const wallet = await sdk.keyPair.utils.mnemonicToWallet(mnemonic)

      expect(wallet.privateKey).toEqual(new Uint8Array([105, 213, 35, 36, 214, 9, 104, 32, 148, 57, 157, 10, 134, 251, 79, 152, 252, 58, 194, 48, 145, 102, 7, 252, 191, 69, 164, 97, 195, 136, 182, 93]))
    })
  })
  describe('wallet', () => {
    test('should be able to derive address from wallet via derive path', async () => {
      const wallet = await sdk.keyPair.utils.mnemonicToWallet(mnemonic, '', true, { versions: 'testnet' })

      const key = await sdk.keyPair.utils.derivePath(wallet, "m/44'/1'/0'/0/0")

      const address = await sdk.keyPair.utils.publicKeyToAddress(key.publicKey)

      expect(address).toEqual('yRGEqFgmuqJct4jzH48sFrvBCc3WuPKDTp')
    })

    test('should be able to derive identity from wallet', async () => {
      const wallet = await sdk.keyPair.utils.mnemonicToWallet(mnemonic, '', true, { versions: 'testnet' })

      const key = await sdk.keyPair.utils.walletToIdentityKey(wallet, 0, 0)

      expect(key.privateKey).toEqual(Uint8Array.from([89, 255, 64, 41, 202, 170, 83, 68, 135, 58, 161, 107, 130, 20, 3, 50, 69, 16, 108, 104, 32, 68, 13, 100, 225, 24, 79, 20, 193, 184, 238, 55]))
    })

    test('should be able to derive identity from mnemonic', async () => {
      const key = await sdk.keyPair.mnemonicToIdentityKey(mnemonic, 0, 0)

      expect(key.privateKey).toEqual(Uint8Array.from([89, 255, 64, 41, 202, 170, 83, 68, 135, 58, 161, 107, 130, 20, 3, 50, 69, 16, 108, 104, 32, 68, 13, 100, 225, 24, 79, 20, 193, 184, 238, 55]))
    })
  })
})
