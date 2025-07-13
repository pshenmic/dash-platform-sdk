import {
  GetDocumentsResponse_GetDocumentsResponseV0,
  GetTotalCreditsInPlatformRequest
} from '../../proto/generated/platform'
import GRPCConnectionPool from '../grpcConnectionPool'
import { verifyTotalCreditsInSystem } from 'wasm-drive-verify'
import { HALVING_INTERVAL, MAINNET_ACTIVATION_HEIGHT, TESTNET_ACTIVATION_HEIGHT } from '../constants'
import { PlatformVersionWASM } from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export default async function totalCredits (grpcPool: GRPCConnectionPool, network: 'testnet' | 'mainnet'): Promise<bigint> {
  const request = GetTotalCreditsInPlatformRequest.fromPartial({ v0: { prove: true } })

  const { v0 } = await grpcPool.getClient().getTotalCreditsInPlatform(request)

  const { proof, metadata } = v0 as GetDocumentsResponse_GetDocumentsResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const activationHeight = network === 'testnet' ? TESTNET_ACTIVATION_HEIGHT : MAINNET_ACTIVATION_HEIGHT

  const { root_hash: rootHash, total_credits: totalCredits } = verifyTotalCreditsInSystem(
    proof.grovedbProof,
    HALVING_INTERVAL,
    activationHeight,
    Number(metadata.height),
    PlatformVersionWASM.PLATFORM_V9
  )

  const quorumPublicKey = await getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return totalCredits
}
