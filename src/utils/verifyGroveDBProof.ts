import ProofError from './ProofError.js'

/**
 * Calls the given GroveDB proof verification function with the given args
 * and rethrows its failure as ProofError, so the request is retried on another node
 */
export default function verifyGroveDBProof<Args extends unknown[], T> (verify: (...args: Args) => T, ...args: Args): T {
  try {
    return verify(...args)
  } catch (e) {
    throw new ProofError(`Failed to verify GroveDB proof: ${String(e)}`, { cause: e })
  }
}
