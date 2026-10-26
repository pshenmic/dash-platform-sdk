import { GetIdentityNonceRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyIdentityNonceProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import QueryExecutor from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

const IDENTITY_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityNonce (grpcPool: GRPCPool, identifier: IdentifierLike): Promise<bigint> {
  const id = new IdentifierWASM(identifier)
  const getIdentityNonceRequest = GetIdentityNonceRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        identityId: id.bytes(),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .setGrpcRequest('getIdentityNonce', getIdentityNonceRequest)
    .setProofVerifier(verifyIdentityNonceProof, id.bytes(), true, LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      const nonce = data.proved ? data.verified.nonce : BigInt(data.result.identityNonce)

      return nonce != null ? nonce & IDENTITY_NONCE_VALUE_FILTER : BigInt(0)
    })
    .execute()
}
