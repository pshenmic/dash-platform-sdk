/**
 * Thrown when the response of a node can not be verified (invalid GroveDB proof, invalid quorum signature, stale metadata).
 * Such node is banned and the request is retried on another node
 */
export default class ProofError extends Error {
  constructor (message: string, options?: { cause?: unknown }) {
    super(message, options)

    this.name = 'ProofError'
  }
}
