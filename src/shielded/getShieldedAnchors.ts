import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { GetShieldedAnchorsRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM } from 'pshenmic-dpp'
import type { DashPlatformShielded } from 'dash-platform-shielded'
import QueryExecutor from '../QueryExecutor.js'

export default async function getShieldedAnchors (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  shielded: DashPlatformShielded,
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
    .setGrpcRequest('getShieldedAnchors', getShieldedAnchorsRequest)
    .setProofVerifier(shielded.verifyShieldedAnchorsProof, (_, platformVersion) => [true, platformVersion, tokenId?.bytes()])
    .mapResponse(data => data.proved ? data.verified.anchors : data.result.anchors.anchors)
    .execute()
}
