import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedNotesCountRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedNotesCountProof } from 'pshenmic-dpp'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'

export default async function getShieldedNotesCount (
  grpcPool: GRPCPool,
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

  return await QueryExecutor.build(grpcPool)
    .setGrpcRequest('getShieldedNotesCount', getShieldedNotesCountRequest)
    .setProofVerifier(verifyShieldedNotesCountProof, true, LATEST_PLATFORM_VERSION, tokenId)
    .mapResponse(data => data.proved ? data.verified.count : BigInt(data.result.totalNotesCount))
    .execute()
}
