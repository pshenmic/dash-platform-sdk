import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedAnchorsRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedAnchorsProof } from 'pshenmic-dpp'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'

export default async function getShieldedAnchors (
  grpcPool: GRPCPool,
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

  return await QueryExecutor.build(grpcPool)
    .setGrpcRequest('getShieldedAnchors', getShieldedAnchorsRequest)
    .setProofVerifier(verifyShieldedAnchorsProof, true, LATEST_PLATFORM_VERSION, tokenId)
    .mapResponse(data => data.proved ? data.verified.anchors : data.result.anchors.anchors)
    .execute()
}
