import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { GetShieldedNotesCountRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM } from 'pshenmic-dpp'
import type { DashPlatformShielded } from 'dash-platform-shielded'
import QueryExecutor from '../QueryExecutor.js'

export default async function getShieldedNotesCount (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  shielded: DashPlatformShielded,
  tokenIdentifier?: IdentifierLike
): Promise<bigint | undefined> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedNotesCountRequest = GetShieldedNotesCountRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getShieldedNotesCount', getShieldedNotesCountRequest)
    .setProofVerifier(shielded.verifyShieldedNotesCountProof, (_, platformVersion) => [true, platformVersion, tokenId?.bytes()])
    .mapResponse(data => data.proved ? data.verified.count : BigInt(data.result.totalNotesCount))
    .execute()
}
