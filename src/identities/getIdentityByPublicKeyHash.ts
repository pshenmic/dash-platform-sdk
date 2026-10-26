import { GetIdentityByPublicKeyHashRequest } from '../../proto/generated/platform.js'
import { IdentityWASM, verifyIdentityByUniqueKeyHashProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import hexToBytes from '../utils/hexToBytes.js'
import QueryExecutor from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getIdentityByPublicKeyHash (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, hex: string): Promise<IdentityWASM> {
  const getIdentityByPublicKeyHashRequest = GetIdentityByPublicKeyHashRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        publicKeyHash: hexToBytes(hex),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getIdentityByPublicKeyHash', getIdentityByPublicKeyHashRequest)
    .setProofVerifier(verifyIdentityByUniqueKeyHashProof, hexToBytes(hex), LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      const identity = data.proved ? data.verified.identity : IdentityWASM.fromBytes(data.result.identity)

      if (identity == null) {
        throw new Error(`Identity with public key hash ${hex} not found`)
      }

      return identity
    })
    .execute()
}
