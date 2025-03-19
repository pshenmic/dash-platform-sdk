import DashPlatformSDK from '../../src/index'
import { DataContractWASM, DocumentWASM, IdentityPublicKeyWASM, IdentityWASM } from 'pshenmic-dpp'

let sdk

describe('DashPlatformSDK', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
  })

  test('should be constructable throw `new`', () => {
    expect(sdk).toEqual(expect.any(DashPlatformSDK))
  })

  test('should be able to call getStatus', async () => {
    const status = await sdk.node.status()

    expect(status.version.software.dapi).toEqual(expect.any(String))
    expect(status.version.software.drive).toEqual(expect.any(String))

    expect(status.version.software.tenderdash).toEqual(expect.any(String))
    expect(status.version.protocol.tenderdash.p2p).toEqual(expect.any(Number))
    expect(status.version.protocol.tenderdash.block).toEqual(expect.any(Number))

    expect(status.version.protocol.drive.latest).toEqual(expect.any(Number))
    expect(status.version.protocol.drive.current).toEqual(expect.any(Number))

    expect(status.node.id).toEqual(expect.any(String))
    expect(status.node.proTxHash).toEqual(expect.any(String))

    expect(status.chain.catchingUp).toEqual(expect.any(Boolean))
    expect(status.chain.latestBlockHash).toEqual(expect.any(String))
    expect(status.chain.latestAppHash).toEqual(expect.any(String))
    expect(status.chain.latestBlockHeight).toEqual(expect.any(String))
    expect(status.chain.earliestBlockHash).toEqual(expect.any(String))
    expect(status.chain.earliestAppHash).toEqual(expect.any(String))
    expect(status.chain.earliestBlockHeight).toEqual(expect.any(String))
    expect(status.chain.maxPeerBlockHeight).toEqual(expect.any(String))
    expect(status.chain.coreChainLockedHeight).toEqual(expect.any(Number))

    expect(status.network.chainId).toEqual(expect.any(String))
    expect(status.network.peersCount).toEqual(expect.any(Number))
    expect(status.network.listening).toEqual(expect.any(Boolean))

    expect(status.stateSync.totalSyncedTime).toEqual(expect.any(String))
    expect(status.stateSync.remainingTime).toEqual(expect.any(String))
    expect(status.stateSync.totalSnapshots).toEqual(expect.any(Number))
    expect(status.stateSync.chunkProcessAvgTime).toEqual(expect.any(String))
    expect(status.stateSync.snapshotHeight).toEqual(expect.any(String))
    expect(status.stateSync.snapshotChunksCount).toEqual(expect.any(String))
    expect(status.stateSync.backfilledBlocks).toEqual(expect.any(String))
    expect(status.stateSync.backfillBlocksTotal).toEqual(expect.any(String))

    expect(status.time.local).toEqual(expect.any(String))
    expect(status.time.block).toEqual(expect.any(String))
    expect(status.time.genesis).toEqual(expect.any(String))
    expect(status.time.epoch).toEqual(expect.any(Number))
  })

  test('should be able to create document', async () => {
    const dataContract = '6QMfQTdKpC3Y9uWBcTwXeY3KdzRLDqASUsDnQ4MEc9XC'
    const identity = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'
    const identityContractNonce = BigInt(1)
    const documentType = 'pool'
    const data = {
      "name": "MyPool",
      "type": "EVONODE",
      "status": "INACTIVE",
      "description": "test pool"
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
    const dataContract = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
    const documentType = 'domain'

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

    const identity = await sdk.identities.getIdentityContractNonce(identifier, dataContract)

    expect(identity).toEqual(expect.any(BigInt))
  })

  test('should be able to get identity nonce', async () => {
    const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'

    const identity = await sdk.identities.getIdentityNonce(identifier)

    expect(identity).toEqual(expect.any(BigInt))
  })

  test('should be able to get identity public keys', async () => {
    const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'

    const identityPublicKeys = await sdk.identities.getIdentityPublicKeys(identifier)

    expect(identityPublicKeys.every(identityPublicKey => identityPublicKey instanceof IdentityPublicKeyWASM)).toBeTruthy();
  })

})
