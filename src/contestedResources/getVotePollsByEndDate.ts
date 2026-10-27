import { VotePollsAtEndDate, VotePollsByEndDateTimeBound, VotePollWASM, verifyVotePollsByEndDateProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { GetVotePollsByEndDateRequest } from '../../proto/generated/platform.js'
import QueryExecutor from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getVotePollsByEndDate (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  startTime?: VotePollsByEndDateTimeBound,
  endTime?: VotePollsByEndDateTimeBound,
  limit?: number,
  ascending: boolean = true
): Promise<VotePollsAtEndDate[]> {
  const getVotePollsByEndDateRequest = GetVotePollsByEndDateRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        startTimeInfo: startTime != null
          ? { startTimeMs: startTime.timeMs.toString(), startTimeIncluded: startTime.included }
          : undefined,
        endTimeInfo: endTime != null
          ? { endTimeMs: endTime.timeMs.toString(), endTimeIncluded: endTime.included }
          : undefined,
        limit,
        ascending,
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getVotePollsByEndDate', getVotePollsByEndDateRequest)
    .setProofVerifier(
      verifyVotePollsByEndDateProof,
      startTime,
      endTime,
      limit,
      ascending,
      LATEST_PLATFORM_VERSION
    )
    .mapResponse(data => {
      if (data.proved) {
        return data.verified.votePolls
      }

      const { result } = data

      if (result.oneofKind !== 'votePollsByTimestamps') {
        return []
      }

      return result.votePollsByTimestamps.votePollsByTimestamps.map(group => ({
        timestampMs: BigInt(group.timestamp),
        votePolls: group.serializedVotePolls.map(bytes => VotePollWASM.fromBytes(bytes))
      }))
    })
    .execute()
}
