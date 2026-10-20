import { PlatformClient } from '../../proto/generated/platform.client.js'
import { GRPCPool } from '../../src/grpcConnectionPool.js'
import QueryExecutor from '../../src/utils/QueryExecutor.js'
import ProofError from '../../src/utils/ProofError.js'

const createPool = (retries?: number): GRPCPool & { clients: PlatformClient[], banned: PlatformClient[], unbanned: PlatformClient[] } => {
  const pool = {
    network: 'testnet' as const,
    retries,
    clients: [] as PlatformClient[],
    banned: [] as PlatformClient[],
    unbanned: [] as PlatformClient[],
    getClient: () => {
      const client = {} as unknown as PlatformClient

      pool.clients.push(client)

      return client
    },
    banNode: (client: PlatformClient) => { pool.banned.push(client) },
    unbanNode: (client: PlatformClient) => { pool.unbanned.push(client) }
  }

  return pool
}

describe('QueryExecutor', () => {
  test('should retry the request on another node on proof error and ban the node', async () => {
    const pool = createPool(3)
    let calls = 0

    const result = await QueryExecutor.build(pool)
      .addGrpcRequest(async () => ({ response: ++calls }))
      .addProof(response => {
        if (response < 3) {
          throw new ProofError('invalid proof')
        }

        return { result: response }
      })
      .setValidateProof(false)
      .execute()

    expect(result).toEqual(3)
    expect(pool.clients).toHaveLength(3)
    expect(pool.banned).toEqual([pool.clients[0], pool.clients[1]])
  })

  test('should throw the proof error when retries are exhausted', async () => {
    const pool = createPool(1)

    await expect(QueryExecutor.build(pool)
      .addGrpcRequest(async () => ({ response: null }))
      .addProof(() => { throw new ProofError('invalid proof') })
      .execute()).rejects.toThrow('invalid proof')

    expect(pool.clients).toHaveLength(2)
    expect(pool.banned).toHaveLength(2)
  })

  test('should not retry on other errors', async () => {
    const pool = createPool(3)

    await expect(QueryExecutor.build(pool)
      .addGrpcRequest(async () => ({ response: null }))
      .addProof(() => { throw new Error('not found') })
      .execute()).rejects.toThrow('not found')

    expect(pool.clients).toHaveLength(1)
    expect(pool.banned).toHaveLength(0)
  })

  test('should not retry if the pool has no retries', async () => {
    const pool = createPool()

    await expect(QueryExecutor.build(pool)
      .addGrpcRequest(async () => ({ response: null }))
      .addProof(() => { throw new ProofError('invalid proof') })
      .execute()).rejects.toThrow('invalid proof')

    expect(pool.clients).toHaveLength(1)
  })

  test('should require proof, metadata and root hash to validate the proof', async () => {
    const pool = createPool(3)

    await expect(QueryExecutor.build(pool)
      .addGrpcRequest(async () => ({ response: 1 }))
      .addProof(response => ({ result: response }))
      .execute()).rejects.toThrow('Proof, metadata and root hash are required')

    expect(pool.unbanned).toHaveLength(0)
  })

  test('should throw if the request or the proof is not set', async () => {
    const pool = createPool()

    await expect(QueryExecutor.build(pool).execute()).rejects.toThrow('GRPC request is not set')
    await expect(QueryExecutor.build(pool)
      .addGrpcRequest(async () => ({ response: 1 }))
      .execute()).rejects.toThrow('Proof verification is not set')
  })
})
