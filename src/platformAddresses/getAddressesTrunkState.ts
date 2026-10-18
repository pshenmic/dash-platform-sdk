import { GRPCPool } from '../grpcConnectionPool.js'
import { verifyAddressesTrunkState } from 'pshenmic-dpp'
import { GetAddressesTrunkStateRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import withProofRetry from '../utils/withProofRetry.js'
import ProofError from '../utils/ProofError.js'
import { PlatformAddressesTrunkState } from '../../types.js'

export async function getAddressesTrunkState (grpcPool: GRPCPool): Promise<PlatformAddressesTrunkState> {
  const getAddressesTrunkStateRequest = GetAddressesTrunkStateRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {}
    }
  })

  return await withProofRetry(grpcPool, async client => {
    const { response } = await client.getAddressesTrunkState(getAddressesTrunkStateRequest)

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

    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, trunk.rootHash, quorumPublicKey)

    if (!verify) {
      throw new ProofError('Failed to verify query')
    }

    return { trunk, metadata }
  })
}
