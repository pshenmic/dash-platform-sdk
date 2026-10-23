import { GetIdentityByNonUniquePublicKeyHashRequest } from '../../proto/generated/platform.js'
import { IdentityWASM, PlatformVersionWASM, verifyFullIdentityByNonUniquePublicKeyHashProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import hexToBytes from '../utils/hexToBytes.js'
import QueryExecutor from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getIdentityByNonUniquePublicKeyHash (grpcPool: GRPCPool, hex: string): Promise<IdentityWASM> {
  const getIdentityByNonUniquePublicKeyHashRequest = GetIdentityByNonUniquePublicKeyHashRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        publicKeyHash: hexToBytes(hex),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getIdentityByNonUniquePublicKeyHash', getIdentityByNonUniquePublicKeyHashRequest)
    .addProofVerifier(verifyFullIdentityByNonUniquePublicKeyHashProof, ({ metadata }) => [hexToBytes(hex), undefined, metadata.protocolVersion as PlatformVersionWASM, LATEST_PLATFORM_VERSION])
    .addMapper(data => {
      const identity = data.proved
        ? data.verified.identity
        : (data.result.identity.identity != null ? IdentityWASM.fromBytes(data.result.identity.identity) : undefined)

      if (identity == null) {
        throw new Error(`Identity with non unique public key hash ${hex} not found`)
      }

      return identity
    })
    .execute()
}
