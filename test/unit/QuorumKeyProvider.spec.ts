import { PlatformExplorerQuorumKeyProvider } from '../../src/quorumKeyProvider.js'

const quorumType = 6
const quorumHash = '000000c7a22005e85321c6cddd716ca2ff0166459fd36ddeb0955e7bd5009c4b'
const quorumPublicKey = '8fc38166902894b507344be2bd637ba1bd969a2a20b429dea5710dd3081d9ef14189776c3204b8714e425957b607ef60'

const explorerUrl = `https://testnet.platform-explorer.pshenmic.dev/quorum/info?quorumType=${quorumType}&quorumHash=${quorumHash}`
const dcgUrl = `https://quorums.testnet.networks.dash.org/quorums/${quorumHash}`

const jsonResponse = (body: unknown, status = 200): Response => new Response(JSON.stringify(body), { status })

describe('PlatformExplorerQuorumKeyProvider', () => {
  let fetchMock: jest.SpyInstance

  afterEach(() => {
    fetchMock.mockRestore()
  })

  test('should return quorum public key from Platform Explorer', async () => {
    fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ quorumPublicKey }))

    const provider = new PlatformExplorerQuorumKeyProvider('testnet')

    expect(await provider.getQuorumPublicKey(quorumType, quorumHash)).toEqual(quorumPublicKey)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(explorerUrl, { method: 'GET' })
  })

  test('should fall back to DCG quorum service when Platform Explorer is unavailable', async () => {
    fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      if (url === explorerUrl) {
        return jsonResponse({}, 502)
      }

      return jsonResponse({ success: true, data: { quorum_hash: quorumHash, key: quorumPublicKey }, message: null })
    })

    const provider = new PlatformExplorerQuorumKeyProvider('testnet')

    expect(await provider.getQuorumPublicKey(quorumType, quorumHash)).toEqual(quorumPublicKey)
    expect(fetchMock).toHaveBeenCalledWith(dcgUrl, { method: 'GET' })
  })

  test('should fall back to DCG quorum service when Platform Explorer request fails', async () => {
    fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      if (url === explorerUrl) {
        throw new TypeError('fetch failed')
      }

      return jsonResponse({ success: true, data: { quorum_hash: quorumHash, key: quorumPublicKey }, message: null })
    })

    const provider = new PlatformExplorerQuorumKeyProvider('testnet')

    expect(await provider.getQuorumPublicKey(quorumType, quorumHash)).toEqual(quorumPublicKey)
  })

  test('should throw when quorum public key is not available in both sources', async () => {
    fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      if (url === explorerUrl) {
        return jsonResponse({}, 500)
      }

      return jsonResponse({ success: false, data: null, message: 'Quorum not found' })
    })

    const provider = new PlatformExplorerQuorumKeyProvider('testnet')

    await expect(provider.getQuorumPublicKey(quorumType, quorumHash))
      .rejects
      .toThrow(`Failed to query quorum public key for quorum ${quorumHash} (type ${quorumType}) from Platform Explorer and DCG quorum service`)
  })

  test('should cache quorum public key', async () => {
    fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ quorumPublicKey }))

    const provider = new PlatformExplorerQuorumKeyProvider('testnet')

    await provider.getQuorumPublicKey(quorumType, quorumHash)
    await provider.getQuorumPublicKey(quorumType, quorumHash)

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
