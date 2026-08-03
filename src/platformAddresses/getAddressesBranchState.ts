import GRPCConnectionPool from '../grpcConnectionPool.js'
import { verifyAddressesBranchState, VerifiedAddressesBranchState } from 'pshenmic-dpp'
import { GetAddressesBranchStateRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export async function getAddressesBranchState (grpcPool: GRPCConnectionPool, key: Uint8Array, depth: number, checkpointHeight: bigint, expectedRootHash: Uint8Array): Promise<VerifiedAddressesBranchState> {
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

  const { response } = await grpcPool.getClient().getAddressesBranchState(getAddressesBranchStateRequest)

  const { version } = response

  if (version.oneofKind !== 'v0') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
  }

  return verifyAddressesBranchState(version.v0.merkProof, key, depth, expectedRootHash, LATEST_PLATFORM_VERSION)
}
