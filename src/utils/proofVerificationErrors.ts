/**
 * Base class for every error thrown while verifying the Tenderdash signature of a DAPI proof
 */
export class ProofVerificationError extends Error {
  constructor (message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = new.target.name
  }
}

/**
 * The quorum key provider returned null, threw, or returned malformed key
 */
export class QuorumKeyUnavailableError extends ProofVerificationError {
  quorumType: number
  quorumHash: Uint8Array

  constructor (quorumType: number, quorumHash: Uint8Array, cause?: unknown) {
    super(`Quorum public key is unavailable for quorum type ${quorumType}`, { cause })
    this.quorumType = quorumType
    this.quorumHash = quorumHash
  }
}

/**
 * A quorum key was found, but the proof signature did not verify with it (or with the key from the retry)
 */
export class ProofSignatureError extends ProofVerificationError {
  quorumType: number
  quorumHash: Uint8Array

  constructor (quorumType: number, quorumHash: Uint8Array, cause?: unknown) {
    super('Proof signature verification failed', { cause })
    this.quorumType = quorumType
    this.quorumHash = quorumHash
  }
}

/**
 * Response metadata is too old, or too far in the future
 */
export class StaleResponseError extends ProofVerificationError {
  timeMs: number
  ageMs: number

  constructor (timeMs: number, ageMs: number) {
    super(ageMs >= 0
      ? `Response is stale (${Math.round(ageMs / 1000)} seconds old)`
      : `Response is from the future (${Math.round(-ageMs / 1000)} seconds ahead)`)
    this.timeMs = timeMs
    this.ageMs = ageMs
  }
}

/**
 * Proof is signed by a quorum type that is not used by the Platform on this network
 */
export class UnexpectedQuorumTypeError extends ProofVerificationError {
  expected: number
  actual: number

  constructor (expected: number, actual: number) {
    super(`Unexpected quorum type ${actual} (expected ${expected})`)
    this.expected = expected
    this.actual = actual
  }
}
