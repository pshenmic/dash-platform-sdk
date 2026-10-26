import { GetIdentityRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, IdentityWASM, verifyIdentityByIdentifierProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import QueryExecutor from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getIdentityByIdentifier (grpcPool: GRPCPool, identifier: IdentifierLike): Promise<IdentityWASM> {
  const id = new IdentifierWASM(identifier)
  const getIdentityRequest = GetIdentityRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        id: id.bytes(),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .setGrpcRequest('getIdentity', getIdentityRequest)
    .setProofVerifier(verifyIdentityByIdentifierProof, id, true, LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      const identity = data.proved ? data.verified.identity : IdentityWASM.fromBytes(data.result.identity)

      if (identity == null) {
        throw new Error(`Identity with identifier ${id.base58()} not found`)
      }

      return identity
    })
    .execute()
}
