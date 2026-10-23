import { GetIdentityNonceRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyIdentityNonceProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
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
    .addGrpcRequest('getIdentityNonce', getIdentityNonceRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        nonce
      } = verifyGroveDBProof(verifyIdentityNonceProof, proof.grovedbProof, id.bytes(), true, LATEST_PLATFORM_VERSION)

      const result = nonce != null ? BigInt(nonce) & IDENTITY_NONCE_VALUE_FILTER : BigInt(0)

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
