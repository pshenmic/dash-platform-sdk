import { DashPlatformSDK } from '../../src/DashPlatformSDK'

let sdk: DashPlatformSDK

describe('Node', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet', dapiUrl: 'https://54.201.32.131:1443' })
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

  test('should be able to call getEpochsInfo in desc', async () => {
    const epochsInfo = await sdk.node.getEpochsInfo(10, false, 8607)

    const expectedEpochsNumbers = Array.from({ length: 10 }, (_val, index) => 8598 + index)

    expect(epochsInfo.length).toEqual(10)
    expect(epochsInfo.map(epochInfo => epochInfo.number)).toEqual(expectedEpochsNumbers)
  })

  test('should be able to call getEpochsInfo in asc', async () => {
    const epochsInfo = await sdk.node.getEpochsInfo(10, true, 8596)

    const expectedEpochsNumbers = Array.from({ length: 10 }, (_val, index) => 8596 + index)

    expect(epochsInfo.length).toEqual(10)
    expect(epochsInfo.map(epochInfo => epochInfo.number)).toEqual(expectedEpochsNumbers)
  })

  test('should be able to call getTotalCreditsInPlatform', async () => {
    const totalCredits = await sdk.node.totalCredits()

    expect(Number(totalCredits)).toBeGreaterThan(0)
  })
})
