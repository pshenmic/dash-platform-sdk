import GRPCConnectionPool from '../../src/grpcConnectionPool.js'
import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'

jest.mock('@protobuf-ts/grpcweb-transport', () => ({
  GrpcWebFetchTransport: class {
    options: { baseUrl: string, abort?: AbortSignal, fetch: typeof globalThis.fetch }

    constructor (options: { baseUrl: string, abort?: AbortSignal, fetch: typeof globalThis.fetch }) {
      this.options = options
    }
  }
}))

jest.mock('../../proto/generated/platform.client.js', () => ({
  PlatformClient: class {
    url: string
    fetch: typeof globalThis.fetch
    signal?: AbortSignal

    constructor (transport: { options: { baseUrl: string, abort?: AbortSignal, fetch: typeof globalThis.fetch } }) {
      this.url = transport.options.baseUrl
      this.fetch = transport.options.fetch
      this.signal = transport.options.abort
    }

    async getStatus (): Promise<{ response: Record<string, unknown> }> {
      await this.fetch(`${this.url}/org.dash.platform.dapi.v0.Platform/getStatus`)

      return {
        response: {
          version: {
            oneofKind: 'v0',
            v0: {
              version: { protocol: { drive: { current: 14 } } },
              chain: { catchingUp: false },
              time: { local: BigInt(Math.floor(Date.now() / 1000)), block: BigInt(Date.now() - 1000) }
            }
          }
        }
      }
    }
  }
}))

interface MockClient {
  url: string
  fetch: typeof globalThis.fetch
  signal?: AbortSignal
}

const NODE_A = 'https://10.0.0.1:1443'
const NODE_B = 'https://10.0.0.2:1443'

const METHOD_PATH = '/org.dash.platform.dapi.v0.Platform/getStatus'
const BROADCAST_PATH = '/org.dash.platform.dapi.v0.Platform/broadcastStateTransition'
const STREAM_PATH = '/org.dash.platform.dapi.v0.Platform/subscribeToBlockHeadersWithChainLocks'
const LONG_POLL_PATH = '/org.dash.platform.dapi.v0.Platform/waitForStateTransitionResult'

const OK_RESPONSE = { ok: true } as unknown as Response

const TESTNET_SEED_A = 'https://153.80.206.232:1443'

const waitFor = async (condition: () => boolean): Promise<void> => {
  for (let i = 0; i < 100; i++) {
    if (condition()) {
      return
    }

    await new Promise(resolve => setImmediate(resolve))
  }

  throw new Error('Condition was not met')
}

const abortError = (): Error => Object.assign(new Error('The operation was aborted'), { name: 'AbortError' })

const connectError = (): TypeError =>
  Object.assign(new TypeError('fetch failed'), { cause: Object.assign(new Error('ECONNREFUSED'), { code: 'ECONNREFUSED' }) })

const hangingFetch = (fetchSpy: jest.SpiedFunction<typeof globalThis.fetch>): void => {
  fetchSpy.mockImplementation(async (_url, init) => await new Promise<Response>((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => reject(abortError()))
  }))
}

describe('GRPCConnectionPool', () => {
  let fetchSpy: jest.SpiedFunction<typeof globalThis.fetch>

  beforeEach(() => {
    fetchSpy = jest.spyOn(globalThis, 'fetch')
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  describe('getClient', () => {
    it('should round-robin over the nodes', async () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: [NODE_A, NODE_B] })

      const urls: string[] = []
      for (let i = 0; i < 4; i++) {
        urls.push((await pool.getClient() as unknown as MockClient).url)
      }

      expect(urls).toEqual([NODE_A, NODE_B, NODE_A, NODE_B])
    })

    it('should pass the abort controller to the client', async () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: NODE_A })
      const abortController = new AbortController()

      const client = await pool.getClient(abortController) as unknown as MockClient

      expect(client.signal).toBe(abortController.signal)
    })
  })

  describe('seed bootstrap', () => {
    it('should resolve immediately with the primary seed and healthcheck in the background', async () => {
      let release: () => void = () => {}
      const gate = new Promise<Response>(resolve => { release = () => resolve(OK_RESPONSE) })
      fetchSpy.mockImplementation(async () => await gate)

      const pool = new GRPCConnectionPool('testnet')
      await pool.getClient()

      // no waiting for a healthcheck: the first request can start right away
      expect(pool.dapiUrls).toEqual([TESTNET_SEED_A])
      expect(fetchSpy).toHaveBeenCalled()

      release()
      await waitFor(() => pool.dapiUrls.length >= 2)
      expect(pool.dapiUrls[0]).toBe(TESTNET_SEED_A)
    })

    it('should promote a fallback seed when the active node is banned', async () => {
      let release: () => void = () => {}
      const gate = new Promise<Response>(resolve => { release = () => resolve(OK_RESPONSE) })
      fetchSpy.mockImplementation(async () => await gate)

      const pool = new GRPCConnectionPool('testnet')
      const client = await pool.getClient()

      expect(pool.dapiUrls).toEqual([TESTNET_SEED_A])

      pool.banNode(client)

      const next = await pool.getClient() as unknown as MockClient

      expect(next.url).not.toBe(TESTNET_SEED_A)
      expect(pool.dapiUrls).toContain(next.url)

      release()
      await new Promise(resolve => setImmediate(resolve))
    })
  })

  describe('fetch retries', () => {
    it('should retry a failed request on the next node and ban the failed one', async () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: [NODE_A, NODE_B] })
      const client = await pool.getClient() as unknown as MockClient

      fetchSpy
        .mockRejectedValueOnce(connectError())
        .mockResolvedValueOnce(OK_RESPONSE)

      const response = await client.fetch(`${NODE_A}${METHOD_PATH}`, { method: 'POST' })

      expect(response).toEqual({ ok: true })
      expect(fetchSpy.mock.calls.map(([url]) => url)).toEqual([`${NODE_A}${METHOD_PATH}`, `${NODE_B}${METHOD_PATH}`])
      expect((await pool.getClient() as unknown as MockClient).url).toBe(NODE_B)
    })

    it('should not retry abort errors', async () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: [NODE_A, NODE_B] })
      const client = await pool.getClient() as unknown as MockClient

      fetchSpy.mockRejectedValueOnce(abortError())

      await expect(client.fetch(`${NODE_A}${METHOD_PATH}`)).rejects.toThrow('The operation was aborted')
      expect(fetchSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('request deadline', () => {
    it('should abort a silent node after requestTimeout and retry on the next node', async () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: [NODE_A, NODE_B], requestTimeout: 30 })
      const client = await pool.getClient() as unknown as MockClient

      fetchSpy.mockImplementation(async (url, init) => {
        if (String(url).startsWith(NODE_A)) {
          return await new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => reject(abortError()))
          })
        }

        return OK_RESPONSE
      })

      const response = await client.fetch(`${NODE_A}${METHOD_PATH}`)

      expect(response).toEqual({ ok: true })
      expect(fetchSpy).toHaveBeenCalledTimes(2)
      // the abandoned request is aborted, freeing the connection
      expect(fetchSpy.mock.calls[0][1]?.signal?.aborted).toBe(true)
      // the silent node is banned
      expect((await pool.getClient() as unknown as MockClient).url).toBe(NODE_B)
    }, 2000)

    it('should abort a silent node after the default 10s deadline', async () => {
      jest.useFakeTimers()

      try {
        const pool = new GRPCConnectionPool('testnet', { dapiUrl: [NODE_A, NODE_B] })
        const client = await pool.getClient() as unknown as MockClient

        fetchSpy.mockImplementation(async (url, init) => {
          if (String(url).startsWith(NODE_A)) {
            return await new Promise<Response>((_resolve, reject) => {
              init?.signal?.addEventListener('abort', () => reject(abortError()))
            })
          }

          return OK_RESPONSE
        })

        const request = client.fetch(`${NODE_A}${METHOD_PATH}`)

        await jest.advanceTimersByTimeAsync(10_000)
        await jest.advanceTimersByTimeAsync(10)

        await expect(request).resolves.toEqual({ ok: true })
      } finally {
        jest.useRealTimers()
      }
    }, 2000)

    it('should abort the underlying fetch when the caller aborts, without retrying or banning', async () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: [NODE_A, NODE_B], requestTimeout: 5000 })
      const client = await pool.getClient() as unknown as MockClient
      const abortController = new AbortController()

      hangingFetch(fetchSpy)

      const request = client.fetch(`${NODE_A}${METHOD_PATH}`, { signal: abortController.signal })
      abortController.abort()

      await expect(request).rejects.toThrow('The operation was aborted')
      expect(fetchSpy).toHaveBeenCalledTimes(1)
      // the caller's signal is wrapped, but its abort still reaches the fetch
      expect(fetchSpy.mock.calls[0][1]?.signal).not.toBe(abortController.signal)
      expect(fetchSpy.mock.calls[0][1]?.signal?.aborted).toBe(true)
      // NODE_A is not banned
      expect((await pool.getClient() as unknown as MockClient).url).toBe(NODE_B)
      expect((await pool.getClient() as unknown as MockClient).url).toBe(NODE_A)
    }, 2000)

    it('should not apply the deadline to streams', async () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: NODE_A, requestTimeout: 30 })
      const client = await pool.getClient() as unknown as MockClient

      let resolveStream: (response: Response) => void = () => {}
      fetchSpy.mockImplementation(async () => await new Promise<Response>(resolve => {
        resolveStream = resolve
      }))

      const request = client.fetch(`${NODE_A}${STREAM_PATH}`)

      await new Promise(resolve => setTimeout(resolve, 80))

      expect(fetchSpy).toHaveBeenCalledTimes(1)
      expect(fetchSpy.mock.calls[0][1]?.signal?.aborted ?? false).toBe(false)

      resolveStream(OK_RESPONSE)
      await expect(request).resolves.toEqual({ ok: true })
    }, 2000)

    it('should not apply the deadline to waitForStateTransitionResult', async () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: NODE_A, requestTimeout: 30 })
      const client = await pool.getClient() as unknown as MockClient

      let resolveLongPoll: (response: Response) => void = () => {}
      fetchSpy.mockImplementation(async () => await new Promise<Response>(resolve => {
        resolveLongPoll = resolve
      }))

      const request = client.fetch(`${NODE_A}${LONG_POLL_PATH}`)

      await new Promise(resolve => setTimeout(resolve, 80))

      expect(fetchSpy).toHaveBeenCalledTimes(1)
      expect(fetchSpy.mock.calls[0][1]?.signal?.aborted ?? false).toBe(false)

      resolveLongPoll(OK_RESPONSE)
      await expect(request).resolves.toEqual({ ok: true })
    }, 2000)

    it('should not retry a broadcast that hit the deadline', async () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: [NODE_A, NODE_B], requestTimeout: 30 })
      const client = await pool.getClient() as unknown as MockClient

      hangingFetch(fetchSpy)

      await expect(client.fetch(`${NODE_A}${BROADCAST_PATH}`)).rejects.toMatchObject({ name: 'TimeoutError', message: 'Request timed out after 30ms' })
      expect(fetchSpy).toHaveBeenCalledTimes(1)
    }, 2000)

    it('should reject with a timeout error when the deadline exhausts the retries', async () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: [NODE_A, NODE_B], retries: 1, requestTimeout: 30 })
      const client = await pool.getClient() as unknown as MockClient

      hangingFetch(fetchSpy)

      await expect(client.fetch(`${NODE_A}${METHOD_PATH}`)).rejects.toMatchObject({ name: 'TimeoutError', message: 'Request timed out after 30ms' })
    }, 2000)

    it('should reject with a timeout error when no other node is available', async () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: NODE_A, requestTimeout: 30 })
      const client = await pool.getClient() as unknown as MockClient

      hangingFetch(fetchSpy)

      await expect(client.fetch(`${NODE_A}${METHOD_PATH}`)).rejects.toMatchObject({ name: 'TimeoutError', message: 'Request timed out after 30ms' })
    }, 2000)

    it('should reset the ban escalation after a successful request', async () => {
      const now = jest.spyOn(Date, 'now').mockReturnValue(1_000_000)
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: [NODE_A, NODE_B] })

      pool.banNode(await pool.getClient())

      now.mockReturnValue(1_000_000 + 61_000)
      await pool.getClient()
      const recovered = await pool.getClient()

      fetchSpy.mockResolvedValueOnce(OK_RESPONSE)
      await (recovered as unknown as MockClient).fetch(`${NODE_A}${METHOD_PATH}`)

      pool.banNode(recovered)

      // the ban after a successful request lasts 60s again, not 60s * e
      now.mockReturnValue(1_000_000 + 61_000 + 61_000)

      const urls = [
        (await pool.getClient() as unknown as MockClient).url,
        (await pool.getClient() as unknown as MockClient).url
      ]

      expect(urls).toContain(NODE_A)
    })

    it.each([0, -1, 1.5])('should reject requestTimeout = %s', (requestTimeout) => {
      expect(() => new GRPCConnectionPool('testnet', { requestTimeout })).toThrow('GRPC requestTimeout must be a positive integer')
    })

    it('should default requestTimeout to 10 seconds', () => {
      const pool = new GRPCConnectionPool('testnet', { dapiUrl: NODE_A })

      expect(pool.requestTimeout).toBe(10_000)
    })
  })

  describe('DashPlatformSDK options', () => {
    it('should pass requestTimeout to the pool', () => {
      const sdk = new DashPlatformSDK({ network: 'testnet', requestTimeout: 1234, grpc: { dapiUrl: NODE_A } })

      expect((sdk.grpcPool as GRPCConnectionPool).requestTimeout).toBe(1234)
    })

    it('should prefer grpc.requestTimeout over the top-level option', () => {
      const sdk = new DashPlatformSDK({ network: 'testnet', requestTimeout: 1234, grpc: { dapiUrl: NODE_A, requestTimeout: 4321 } })

      expect((sdk.grpcPool as GRPCConnectionPool).requestTimeout).toBe(4321)
    })
  })
})
