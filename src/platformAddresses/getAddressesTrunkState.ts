import { GRPCPool } from '../grpcConnectionPool.js'
import { verifyAddressesTrunkState } from 'pshenmic-dpp'
import { GetAddressesTrunkStateRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor from '../QueryExecutor.js'
import { PlatformAddressesTrunkState } from '../../types.js'

export async function getAddressesTrunkState (grpcPool: GRPCPool): Promise<PlatformAddressesTrunkState> {
  const getAddressesTrunkStateRequest = GetAddressesTrunkStateRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {}
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getAddressesTrunkState', getAddressesTrunkStateRequest)
    .addProof(response => {
      const { version } = response

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

      const trunk = verifyGroveDBProof(verifyAddressesTrunkState, proof.grovedbProof, LATEST_PLATFORM_VERSION)

      return { result: { trunk, metadata }, rootHash: trunk.rootHash, proof, metadata }
    })
    .execute()
}
