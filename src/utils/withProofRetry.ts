import { PlatformClient } from '../../proto/generated/platform.client.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import ProofError from './ProofError.js'
import sleep from './sleep.js'

const RETRY_DELAY_MS = 10

/**
 * Runs the request together with its proof verification and reruns it from the start on another node
 * if the proof is invalid. The node that returned the invalid proof is banned, the node that returned
 * a valid one is unbanned. Any other error (including "not found") is returned immediately
 */
export default async function withProofRetry<T> (grpcPool: GRPCPool, request: (client: PlatformClient) => Promise<T>): Promise<T> {
  // custom pools without retries are not retried
  const retries = grpcPool.retries ?? 0
  let lastError: ProofError | undefined

  for (let retry = 0; ; retry++) {
    let client: PlatformClient

    try {
      client = await grpcPool.getClient()
    } catch (e) {
      // every node is banned, the last proof error is more useful than "no available nodes"
      throw lastError ?? e
    }

    try {
      const result = await request(client)

      grpcPool.unbanNode?.(client)

      return result
    } catch (e) {
      if (!(e instanceof ProofError)) {
        throw e
      }

      grpcPool.banNode?.(client)

      if (retry >= retries) {
        throw e
      }

      lastError = e

      await sleep(RETRY_DELAY_MS)
    }
  }
}
