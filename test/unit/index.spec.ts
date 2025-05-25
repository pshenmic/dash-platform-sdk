import {DashPlatformSDK} from '../../src/index'

import {DataContractWASM, DocumentWASM, IdentityPublicKeyWASM, IdentityWASM} from 'pshenmic-dpp'
import * as DashHD from "dashhd";
import {derivePath, toIdBytes} from "dashhd";

let sdk: DashPlatformSDK
let mnemonic: string

describe('DashPlatformSDK', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
    mnemonic = 'deliver frame tomato ring tool second dream mutual fade sponsor visa teach'
  })

  test('should be constructable throw `new`', () => {
    expect(sdk).toEqual(expect.any(DashPlatformSDK))
  })

  test('should be able to call getStatus', async () => {
    const status = await sdk.node.status()

    expect(status.version?.software?.dapi).toEqual(expect.any(String))
    expect(status.version?.software?.drive).toEqual(expect.any(String))

    expect(status.version?.software?.tenderdash).toEqual(expect.any(String))
    expect(status.version?.protocol?.tenderdash?.p2p).toEqual(expect.any(Number))
    expect(status.version?.protocol?.tenderdash?.block).toEqual(expect.any(Number))

    expect(status.version?.protocol?.drive?.latest).toEqual(expect.any(Number))
    expect(status.version?.protocol?.drive?.current).toEqual(expect.any(Number))

    expect(status.node?.id).toEqual(expect.any(String))
    expect(status.node?.proTxHash).toEqual(expect.any(String))

    expect(status.chain?.catchingUp).toEqual(expect.any(Boolean))
    expect(status.chain?.latestBlockHash).toEqual(expect.any(String))
    expect(status.chain?.latestAppHash).toEqual(expect.any(String))
    expect(status.chain?.latestBlockHeight).toEqual(expect.any(String))
    expect(status.chain?.earliestBlockHash).toEqual(expect.any(String))
    expect(status.chain?.earliestAppHash).toEqual(expect.any(String))
    expect(status.chain?.earliestBlockHeight).toEqual(expect.any(String))
    expect(status.chain?.maxPeerBlockHeight).toEqual(expect.any(String))
    expect(status.chain?.coreChainLockedHeight).toEqual(expect.any(Number))

    expect(status.network?.chainId).toEqual(expect.any(String))
    expect(status.network?.peersCount).toEqual(expect.any(Number))
    expect(status.network?.listening).toEqual(expect.any(Boolean))

    expect(status.stateSync?.totalSyncedTime).toEqual(expect.any(String))
    expect(status.stateSync?.remainingTime).toEqual(expect.any(String))
    expect(status.stateSync?.totalSnapshots).toEqual(expect.any(Number))
    expect(status.stateSync?.chunkProcessAvgTime).toEqual(expect.any(String))
    expect(status.stateSync?.snapshotHeight).toEqual(expect.any(String))
    expect(status.stateSync?.snapshotChunksCount).toEqual(expect.any(String))
    expect(status.stateSync?.backfilledBlocks).toEqual(expect.any(String))
    expect(status.stateSync?.backfillBlocksTotal).toEqual(expect.any(String))

    expect(status.time?.local).toEqual(expect.any(String))
    expect(status.time?.block).toEqual(expect.any(String))
    expect(status.time?.genesis).toEqual(expect.any(String))
    expect(status.time?.epoch).toEqual(expect.any(Number))
  })

  test('should be able to create document', async () => {
    const dataContract = '6QMfQTdKpC3Y9uWBcTwXeY3KdzRLDqASUsDnQ4MEc9XC'
    const identity = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'
    const identityContractNonce = BigInt(1)
    const documentType = 'pool'
    const data = {
      name: 'MyPool',
      type: 'EVONODE',
      status: 'INACTIVE',
      description: 'test pool'
    }

    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    expect(document).toEqual(expect.any(DocumentWASM))
  })

  test('should be able to get data contract', async () => {
    const dataContractIdentifier = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

    const dataContract = await sdk.dataContracts.getByIdentifier(dataContractIdentifier)

    expect(dataContract).toEqual(expect.any(DataContractWASM))
  })

  test('should be able to get documents', async () => {
    const dataContract = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
    const documentType = 'domain'

    const [document] = await sdk.documents.query(dataContract, documentType)

    expect(document).toEqual(expect.any(DocumentWASM))
  })

  test('should be able to search names by DPNS name', async () => {
    const [document] = await sdk.names.search('xyz.dash')

    expect(document).toEqual(expect.any(DocumentWASM))
  })

  test('should be able to get identity by identifier', async () => {
    const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'

    const identity = await sdk.identities.getByIdentifier(identifier)

    expect(identity).toEqual(expect.any(IdentityWASM))
  })

  test('should be able to get identity by public key hash', async () => {
    const publicKeyHash = 'c5b7fdfa5731e1b31b1b42c13959756e8db22b3b'

    const identity = await sdk.identities.getByPublicKeyHash(publicKeyHash)

    expect(identity).toEqual(expect.any(IdentityWASM))
  })

  test('should be able to get identity contract nonce', async () => {
    const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'
    const dataContract = '6QMfQTdKpC3Y9uWBcTwXeY3KdzRLDqASUsDnQ4MEc9XC'

    const identityContractNonce = await sdk.identities.getIdentityContractNonce(identifier, dataContract)

    expect(identityContractNonce).toEqual(expect.any(BigInt))
  })

  test('should be able to get identity nonce', async () => {
    const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'

    const identityNonce = await sdk.identities.getIdentityNonce(identifier)

    expect(identityNonce).toEqual(expect.any(BigInt))
  })

  test('should be able to get identity public keys', async () => {
    const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'

    const identityPublicKeys = await sdk.identities.getIdentityPublicKeys(identifier)

    expect(identityPublicKeys.every(identityPublicKey => identityPublicKey instanceof IdentityPublicKeyWASM)).toBeTruthy()
  })

  test('should be able to get balance', async () => {
    const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'

    const balance = await sdk.identities.getBalance(identifier)

    expect(balance).toEqual(expect.any(BigInt))
  })

  describe('KeyPair', () => {
    describe('mnemonic', () => {
      test('should be able to get seed from mnemonic', async () => {
        const seed = await sdk.keyPairs.utils.mnemonicToSeed(mnemonic, '', true)

        // TODO: Get mock data from sdk
        expect(seed).toEqual(Uint8Array.from([170,120,192,223,47,43,142,250,243,136,44,236,84,170,156,154,126,231,185,130,242,40,134,27,36,33,187,102,29,177,119,141,61,157,81,35,85,33,43,28,108,24,108,159,119,233,104,100,2,206,18,245,142,99,19,143,141,0,207,31,143,58,245,107]))
      })

      test('should be able to get wallet from seed', async () => {
        const seed = Uint8Array.from([170,120,192,223,47,43,142,250,243,136,44,236,84,170,156,154,126,231,185,130,242,40,134,27,36,33,187,102,29,177,119,141,61,157,81,35,85,33,43,28,108,24,108,159,119,233,104,100,2,206,18,245,142,99,19,143,141,0,207,31,143,58,245,107])

        const wallet = await sdk.keyPairs.utils.seedToWalletKey(seed, {versions: 'testnet'})

        expect(wallet.privateKey).toEqual(new Uint8Array([105,213,35,36,214,9,104,32,148,57,157,10,134,251,79,152,252,58,194,48,145,102,7,252,191,69,164,97,195,136,182,93]))
      })

      test('should be able to get wallet from mnemonic', async () => {
        const wallet = await sdk.keyPairs.utils.mnemonicToWalletKey(mnemonic, '', true, {versions: 'testnet'})

        expect(wallet.privateKey).toEqual(new Uint8Array([105,213,35,36,214,9,104,32,148,57,157,10,134,251,79,152,252,58,194,48,145,102,7,252,191,69,164,97,195,136,182,93]))
      })

      test('should be able to get wallet for testnet from mnemonic without options', async () => {
        const wallet = await sdk.keyPairs.utils.mnemonicToWalletKey(mnemonic)

        expect(wallet.privateKey).toEqual(new Uint8Array([105,213,35,36,214,9,104,32,148,57,157,10,134,251,79,152,252,58,194,48,145,102,7,252,191,69,164,97,195,136,182,93]))
      })
    })
    describe('wallet', () => {
      test('should be able to derive address from wallet via derive path', async () => {
        const wallet = await sdk.keyPairs.utils.mnemonicToWalletKey(mnemonic, '', true, {versions: 'testnet'})

        const key = await sdk.keyPairs.utils.derivePath(wallet, "m/44'/1'/0'/0/0")

        const address = await sdk.keyPairs.utils.publicKeyToAddress(key.publicKey)

        expect(address).toEqual('yRGEqFgmuqJct4jzH48sFrvBCc3WuPKDTp')
      })

      test('should be able to derive identity from wallet', async () => {
        const wallet = await sdk.keyPairs.utils.mnemonicToWalletKey(mnemonic, '', true, {versions: 'testnet'})

        const key = await sdk.keyPairs.utils.walletToIdentityKey(wallet, 0, 0)

        expect(key.privateKey).toEqual(Uint8Array.from([89,255,64,41,202,170,83,68,135,58,161,107,130,20,3,50,69,16,108,104,32,68,13,100,225,24,79,20,193,184,238,55]))
      })

      test('should be able to derive identity from mnemonic', async () => {
        const key = await sdk.keyPairs.mnemonicToIdentityKey(mnemonic, 0, 0)

        expect(key.privateKey).toEqual(Uint8Array.from([89,255,64,41,202,170,83,68,135,58,161,107,130,20,3,50,69,16,108,104,32,68,13,100,225,24,79,20,193,184,238,55]))
      })
    })
  })
})
