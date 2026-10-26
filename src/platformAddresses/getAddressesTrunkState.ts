import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { verifyAddressesTrunkState } from 'pshenmic-dpp'
import { GetAddressesTrunkStateRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'
import { PlatformAddressesTrunkState } from '../../types.js'

export async function getAddressesTrunkState (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider): Promise<PlatformAddressesTrunkState> {
  const getAddressesTrunkStateRequest = GetAddressesTrunkStateRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {}
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getAddressesTrunkState', getAddressesTrunkStateRequest)
    .mapProof(({ version }) => {
      if (version.oneofKind !== 'v0') {
        throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
      }

      const { v0: { proof, metadata } } = version

      if (proof == null) {
        throw new Error('Proof not found')
      }

      if (metadata == null) {
        throw new Error('Metadata not found')
      }

      return { proof, metadata }
    })
    .setProofVerifier(verifyAddressesTrunkState, LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      if (!data.proved) {
        throw new Error('Addresses trunk state can only be requested with proof')
      }

      return { trunk: data.verified, metadata: data.metadata }
    })
    .execute()
}
