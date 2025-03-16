import DashPlatformSDK from '../../index'

let sdk

describe('DashPlatformSDK', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
  })

  test('should be constructable throw `new`', () => {
    expect(sdk).toEqual(expect.any(DashPlatformSDK))
  })

  test('should be able to call getStatus', async () => {
    const status = await sdk.utils.getStatus()

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

  test('should be able to call getDocuments()', async () => {
    const documents = await sdk.documents.get('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', 'domain')

    expect(documents.length).toEqual(100)
  })
})
