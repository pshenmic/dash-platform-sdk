import { GetIdentityRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, IdentityWASM, verifyIdentityByIdentifierProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
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
    .addGrpcRequest('getIdentity', getIdentityRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        identity
      } = verifyGroveDBProof(verifyIdentityByIdentifierProof, proof.grovedbProof, id, true, LATEST_PLATFORM_VERSION)

      if (identity == null) {
        throw new Error(`Identity with identifier ${id.base58()} not found`)
      }

      const result = identity

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
