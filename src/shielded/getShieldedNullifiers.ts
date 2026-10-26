import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedNullifiersRequest } from '../../proto/generated/platform.js'
import { ShieldedNullifierStatus } from '../../types.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedNullifiersProof } from 'pshenmic-dpp'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'

export default async function getShieldedNullifiers (
  grpcPool: GRPCPool,
  nullifiers: Uint8Array[],
  tokenIdentifier?: IdentifierLike
): Promise<ShieldedNullifierStatus[]> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedNullifiersRequest = GetShieldedNullifiersRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        nullifiers,
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .setGrpcRequest('getShieldedNullifiers', getShieldedNullifiersRequest)
    .setProofVerifier(verifyShieldedNullifiersProof, nullifiers, true, LATEST_PLATFORM_VERSION, tokenId)
    .mapResponse(data => {
      const nullifiersStatuses = data.proved ? data.verified.nullifiers : data.result.nullifierStatuses.entries

      return nullifiersStatuses.map(entry => ({
        nullifier: entry.nullifier,
        isSpent: entry.isSpent
      }))
    })
    .execute()
}
