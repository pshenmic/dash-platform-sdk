import GRPCConnectionPool from '../grpcConnectionPool.js'
import { verifyAddressesTrunkState } from 'pshenmic-dpp'
import { GetAddressesTrunkStateRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import { PlatformAddressesTrunkState } from '../../types.js'

export async function getAddressesTrunkState (grpcPool: GRPCConnectionPool): Promise<PlatformAddressesTrunkState> {
  const getAddressesTrunkStateRequest = GetAddressesTrunkStateRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {}
    }
  })

  const { response } = await grpcPool.getClient().getAddressesTrunkState(getAddressesTrunkStateRequest)

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

  const trunk = verifyAddressesTrunkState(proof.grovedbProof, LATEST_PLATFORM_VERSION)

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, trunk.rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return { trunk, metadata }
}
