import { GetTotalCreditsInPlatformRequest } from '../../proto/generated/platform.js'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import {
  HALVING_INTERVAL,
  LATEST_PLATFORM_VERSION,
  MAINNET_ACTIVATION_HEIGHT,
  TESTNET_ACTIVATION_HEIGHT
} from '../constants.js'
import { verifyTotalCreditsProof } from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import { Network } from '../../types.js'

export default async function totalCredits (grpcPool: GRPCConnectionPool, network: Network): Promise<bigint> {
  const getTotalCreditsInPlatformRequest = GetTotalCreditsInPlatformRequest.create({
    version: {
      oneofKind: 'v0',
      v0: { prove: true }
    }
  })

  const { response } = await grpcPool.getClient().getTotalCreditsInPlatform(getTotalCreditsInPlatformRequest)

  const { version } = response

  if (version.oneofKind !== 'v0') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
  }

  const { v0 } = version

  if (v0.result.oneofKind !== 'proof') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be proof)')
  }

  const { result: { proof }, metadata } = v0

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const activationHeight = network === 'testnet' ? TESTNET_ACTIVATION_HEIGHT : MAINNET_ACTIVATION_HEIGHT

  const { rootHash, totalCredits } = verifyTotalCreditsProof(
    proof.grovedbProof,
    HALVING_INTERVAL,
    activationHeight,
    Number(metadata.height),
    LATEST_PLATFORM_VERSION
  )

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return totalCredits
}
