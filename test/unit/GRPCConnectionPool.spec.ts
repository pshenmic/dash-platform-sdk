import GRPCConnectionPool, { GRPC_DEFAULT_CONNECT_RETRIES } from '../../src/grpcConnectionPool.js'
import { BroadcastStateTransitionRequest, GetStatusRequest } from '../../proto/generated/platform.js'
import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'

// more nodes than attempts, so retries are not limited by the pool size
const DAPI_URLS = Array.from({ length: GRPC_DEFAULT_CONNECT_RETRIES + 5 }, (_, i) => `https://10.0.0.${i + 1}:1443`)

const METHOD_PATH = '/org.dash.platform.dapi.v0.Platform/getStatus'

// errors in the same shape as thrown by undici (global fetch in Node.js)
const connectError = (): TypeError => new TypeError('fetch failed', {
  cause: Object.assign(new Error('Connect Timeout Error'), { code: 'UND_ERR_CONNECT_TIMEOUT' })
})

const tlsHandshakeResetError = (): TypeError => new TypeError('fetch failed', {
  cause: Object.assign(new Error('Client network socket disconnected before secure TLS connection was established'), { code: 'ECONNRESET' })
})

// node received the request and closed the connection
const socketError = (): TypeError => new TypeError('fetch failed', {
  cause: Object.assign(new Error('other side closed'), { code: 'UND_ERR_SOCKET' })
})

const getStatus = async (pool: GRPCConnectionPool): Promise<void> => {
  const client = await pool.getClient()

  await client.getStatus(GetStatusRequest.create({})).response
}

const broadcast = async (pool: GRPCConnectionPool): Promise<void> => {
  const client = await pool.getClient()

  await client.broadcastStateTransition(BroadcastStateTransitionRequest.create({ stateTransition: new Uint8Array([1]) })).response
}

describe('GRPCConnectionPool', () => {
  let fetchMock: jest.SpyInstance

  const requestedUrls = (): string[] => fetchMock.mock.calls.map(([input]) => String(input))

  beforeEach(() => {
    fetchMock = jest.spyOn(globalThis, 'fetch')
  })

  afterEach(() => {
    fetchMock.mockRestore()
  })

  test('should retry request on another node if connection could not be established', async () => {
    fetchMock
      .mockRejectedValueOnce(connectError())
      .mockResolvedValueOnce(new Response('not found', { status: 404 }))

    await expect(getStatus(new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS }))).rejects.toThrow()

    const urls = requestedUrls()

    expect(urls).toHaveLength(2)
    expect(new Set(urls).size).toEqual(2)
    urls.forEach(url => {
      expect(DAPI_URLS.map(dapiUrl => `${dapiUrl}${METHOD_PATH}`)).toContain(url)
    })
  })

  test('should retry request on another node if connection was closed after the request was sent', async () => {
    fetchMock
      .mockRejectedValueOnce(socketError())
      .mockResolvedValueOnce(new Response('not found', { status: 404 }))

    await expect(getStatus(new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS }))).rejects.toThrow()

    expect(new Set(requestedUrls()).size).toEqual(2)
  })

  test('should give up after GRPC_DEFAULT_CONNECT_RETRIES retries on different nodes', async () => {
    fetchMock.mockRejectedValue(connectError())

    await expect(getStatus(new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS }))).rejects.toThrow('Connect Timeout Error')

    const urls = requestedUrls()

    expect(urls).toHaveLength(GRPC_DEFAULT_CONNECT_RETRIES + 1)
    expect(new Set(urls).size).toEqual(GRPC_DEFAULT_CONNECT_RETRIES + 1)
  })

  test('should use retries count from options', async () => {
    fetchMock.mockRejectedValue(connectError())

    await expect(getStatus(new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS, retries: 4 }))).rejects.toThrow('Connect Timeout Error')

    expect(new Set(requestedUrls()).size).toEqual(5)
  })

  test('should not retry request if retries are disabled', async () => {
    fetchMock.mockRejectedValue(connectError())

    await expect(getStatus(new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS, retries: 0 }))).rejects.toThrow('Connect Timeout Error')

    expect(requestedUrls()).toHaveLength(1)
  })

  test('should pass retries option from the SDK', async () => {
    fetchMock.mockRejectedValue(connectError())

    const sdk = new DashPlatformSDK({ network: 'testnet', grpc: { dapiUrl: DAPI_URLS, retries: 1 } })

    await expect(getStatus(sdk.grpcPool as GRPCConnectionPool)).rejects.toThrow('Connect Timeout Error')

    expect(requestedUrls()).toHaveLength(2)
  })

  test.each([-1, 1.5, NaN])('should throw on invalid retries count %p', (retries) => {
    expect(() => new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS, retries })).toThrow('GRPC retries must be a non-negative integer')
  })

  test('should retry request on another node if node urls have trailing slash', async () => {
    fetchMock
      .mockRejectedValueOnce(connectError())
      .mockResolvedValueOnce(new Response('not found', { status: 404 }))

    await expect(getStatus(new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS.slice(0, 2).map(url => `${url}/`) }))).rejects.toThrow()

    expect(requestedUrls()).toEqual(DAPI_URLS.slice(0, 2).map(url => `${url}${METHOD_PATH}`))
  })

  test('should not retry request if node responded with an error', async () => {
    fetchMock.mockResolvedValue(new Response('not found', { status: 404 }))

    await expect(getStatus(new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS }))).rejects.toThrow()

    expect(requestedUrls()).toHaveLength(1)
  })

  test('should not retry request if there are no other nodes in the pool', async () => {
    fetchMock.mockRejectedValue(connectError())

    await expect(getStatus(new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS[0] }))).rejects.toThrow('Connect Timeout Error')

    expect(requestedUrls()).toEqual([`${DAPI_URLS[0]}${METHOD_PATH}`])
  })

  describe('round-robin', () => {
    const nodeUrl = (index: number): string => `${DAPI_URLS[index]}${METHOD_PATH}`

    test('should send every next request to the next node, wrapping to the first one', async () => {
      fetchMock.mockImplementation(async () => new Response('not found', { status: 404 }))

      const pool = new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS })

      for (let i = 0; i < DAPI_URLS.length + 2; i++) {
        await expect(getStatus(pool)).rejects.toThrow()
      }

      expect(requestedUrls()).toEqual([...DAPI_URLS.map((_, i) => nodeUrl(i)), nodeUrl(0), nodeUrl(1)])
    })

    test('should continue from the next node after a retry', async () => {
      fetchMock
        .mockRejectedValueOnce(connectError())
        .mockImplementation(async () => new Response('not found', { status: 404 }))

      const pool = new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS })

      await expect(getStatus(pool)).rejects.toThrow()
      await expect(getStatus(pool)).rejects.toThrow()

      // first request: node 0 failed, retried on node 1, second request goes to node 2
      expect(requestedUrls()).toEqual([nodeUrl(0), nodeUrl(1), nodeUrl(2)])
    })
  })

  describe('broadcast', () => {
    test('should retry broadcast on another node if connection could not be established', async () => {
      fetchMock
        .mockRejectedValueOnce(connectError())
        .mockRejectedValueOnce(tlsHandshakeResetError())
        .mockResolvedValueOnce(new Response('not found', { status: 404 }))

      await expect(broadcast(new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS }))).rejects.toThrow()

      expect(new Set(requestedUrls()).size).toEqual(3)
    })

    test('should not retry broadcast if connection was closed after the request was sent', async () => {
      fetchMock.mockRejectedValue(socketError())

      await expect(broadcast(new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS }))).rejects.toThrow('other side closed')

      expect(requestedUrls()).toHaveLength(1)
    })

    test('should not retry broadcast if connection was reset after the request was sent', async () => {
      fetchMock.mockRejectedValue(new TypeError('fetch failed', {
        cause: Object.assign(new Error('read ECONNRESET'), { code: 'ECONNRESET' })
      }))

      await expect(broadcast(new GRPCConnectionPool('testnet', { dapiUrl: DAPI_URLS }))).rejects.toThrow('read ECONNRESET')

      expect(requestedUrls()).toHaveLength(1)
    })
  })
})
