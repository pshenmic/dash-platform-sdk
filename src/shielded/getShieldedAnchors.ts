import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { GetShieldedAnchorsRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedAnchorsProof } from 'pshenmic-dpp'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'

export default async function getShieldedAnchors (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  tokenIdentifier?: IdentifierLike
): Promise<Uint8Array[]> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedAnchorsRequest = GetShieldedAnchorsRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .addGrpcRequest('getShieldedAnchors', getShieldedAnchorsRequest)
    .addProofVerifier(verifyShieldedAnchorsProof, true, LATEST_PLATFORM_VERSION, tokenId)
    .addMapper(data => data.proved ? data.verified.anchors : data.result.anchors.anchors)
    .execute()
}
