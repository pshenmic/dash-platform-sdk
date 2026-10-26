import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { verifyAddressesBranchState, VerifiedAddressesBranchState } from 'pshenmic-dpp'
import { GetAddressesBranchStateRequest, Proof, ResponseMetadata } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'

export async function getAddressesBranchState (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, key: Uint8Array, depth: number, checkpointHeight: bigint, expectedRootHash: Uint8Array): Promise<VerifiedAddressesBranchState> {
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
  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getAddressesBranchState', getAddressesBranchStateRequest)
    // the response has no proof message, only the merk proof
    .mapProof(({ version }) => {
      if (version.oneofKind !== 'v0') {
        throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
      }

      return { proof: Proof.create({ grovedbProof: version.v0.merkProof }), metadata: ResponseMetadata.create() }
    })
    .setProofVerifier(verifyAddressesBranchState, key, depth, expectedRootHash, LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      if (!data.proved) {
        throw new Error('Addresses branch state can only be requested with proof')
      }

      return data.verified
    })
    .setValidateProof(false)
    .execute()
}
