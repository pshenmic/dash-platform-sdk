import { CanonicalVote } from '../../proto/generated/platform.js'
import { calculateMsgHash } from './calculateMsgHash.js'
import signRequestId from './signRequestId.js'
import signHash from './signHash.js'

export async function calculateSignHash (commit: CanonicalVote, chainId: string, quorumType: number, quorumHash: Uint8Array, height: bigint, round: number): Promise<Uint8Array> {
  const requestId = await signRequestId('dpbvote', height, round)
  const signBytesHash = await calculateMsgHash(chainId, height, round, commit.type, commit.blockId, commit.stateId)

  return await signHash(quorumType, quorumHash, requestId, signBytesHash)
}
