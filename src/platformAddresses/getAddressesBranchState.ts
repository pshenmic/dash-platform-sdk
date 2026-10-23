import { GRPCPool } from '../grpcConnectionPool.js'
import { verifyAddressesBranchState, VerifiedAddressesBranchState } from 'pshenmic-dpp'
import { GetAddressesBranchStateRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor from '../QueryExecutor.js'

export async function getAddressesBranchState (grpcPool: GRPCPool, key: Uint8Array, depth: number, checkpointHeight: bigint, expectedRootHash: Uint8Array): Promise<VerifiedAddressesBranchState> {
  const getAddressesBranchStateRequest = GetAddressesBranchStateRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        key,
        depth,
        checkpointHeight: checkpointHeight.toString()
      }
    }
  })

  // the proof is verified against the root hash of the already verified trunk state, so it has no quorum signature
  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getAddressesBranchState', getAddressesBranchStateRequest)
    .addProof(response => {
      const { version } = response

      if (version.oneofKind !== 'v0') {
        throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
      }

      return { result: verifyGroveDBProof(verifyAddressesBranchState, version.v0.merkProof, key, depth, expectedRootHash, LATEST_PLATFORM_VERSION) }
    })
    .setValidateProof(false)
    .execute()
}
