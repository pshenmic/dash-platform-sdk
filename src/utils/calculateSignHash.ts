import { CanonicalVote } from '../../proto/generated/platform'
import { calculateMsgHash } from './calculateMsgHash'
import signRequestId from './signRequestId'
import signHash from './signHash'

export function calculateSignHash (commit: CanonicalVote, chainId: string, quorumType: number, quorumHash: Uint8Array, height: bigint, round: number): Uint8Array {
  const requestId = signRequestId('dpbvote', height, round)
  const signBytesHash = calculateMsgHash(chainId, height, round, commit.type, commit.blockId, commit.stateId)

  return signHash(quorumType, quorumHash, requestId, signBytesHash)
}
