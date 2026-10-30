import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { GetShieldedPoolStateRequest } from '../../proto/generated/platform.js'
import QueryExecutor from '../QueryExecutor.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedPoolStateProof } from 'pshenmic-dpp'
import { SHIELDED_PLATFORM_VERSION } from '../constants.js'

export default async function getShieldedPoolState (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  tokenIdentifier?: IdentifierLike
): Promise<bigint | undefined> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedPoolStateRequest = GetShieldedPoolStateRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getShieldedPoolState', getShieldedPoolStateRequest)
    .setProofVerifier(verifyShieldedPoolStateProof, true, SHIELDED_PLATFORM_VERSION, tokenId)
    .mapResponse(data => data.proved ? data.verified.totalBalance : BigInt(data.result.totalBalance))
    .execute()
}
