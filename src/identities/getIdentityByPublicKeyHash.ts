import { GetIdentityByPublicKeyHashRequest } from '../../proto/generated/platform.js'
import { IdentityWASM, verifyIdentityByUniqueKeyHashProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import hexToBytes from '../utils/hexToBytes.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../utils/QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getIdentityByPublicKeyHash (grpcPool: GRPCPool, hex: string): Promise<IdentityWASM> {
  const getIdentityByPublicKeyHashRequest = GetIdentityByPublicKeyHashRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        publicKeyHash: hexToBytes(hex),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest(client => client.getIdentityByPublicKeyHash(getIdentityByPublicKeyHashRequest))
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        identity
      } = verifyGroveDBProof(verifyIdentityByUniqueKeyHashProof, proof.grovedbProof, hexToBytes(hex), LATEST_PLATFORM_VERSION)

      if (identity == null) {
        throw new Error(`Identity with public key hash ${hex} not found`)
      }

      const result = identity

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
