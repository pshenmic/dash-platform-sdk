import { GetTotalCreditsInPlatformRequest } from '../../proto/generated/platform'
import GRPCConnectionPool from '../grpcConnectionPool'
import { HALVING_INTERVAL, MAINNET_ACTIVATION_HEIGHT, TESTNET_ACTIVATION_HEIGHT } from '../constants'
import { PlatformVersionWASM, verifyTotalCreditsProof } from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'
import { Network } from '../types'

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
    PlatformVersionWASM.PLATFORM_V9
  )

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return totalCredits
}
