import { DashPlatformSDK } from '../../src'

let sdk: DashPlatformSDK

describe('Node', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
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

  test('should be able to call getEpochsInfo in desc', async () => {
    const epochsInfo = await sdk.node.getEpochsInfo(10, 8400)

    const expectedEpochsNumbers = Array.from({length: 10}, (_val, index) => 8391 + index)

    expect(epochsInfo.length).toEqual(10)
    expect(epochsInfo.map(epochInfo => epochInfo.number)).toEqual(expectedEpochsNumbers)
  })

  test('should be able to call getEpochsInfo in asc', async () => {
    const epochsInfo = await sdk.node.getEpochsInfo(10, 8400, true)

    const expectedEpochsNumbers = Array.from({length: 10}, (_val, index) => 8400 + index)

    expect(epochsInfo.length).toEqual(10)
    expect(epochsInfo.map(epochInfo => epochInfo.number)).toEqual(expectedEpochsNumbers)
  })

  test('should be able to call getTotalCreditsInPlatform', async () => {
    const totalCredits = await sdk.node.totalCredits()

    expect(Number(totalCredits)).toBeGreaterThan(0)
  })
})
