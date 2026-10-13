import { CanonicalVote, Proof, ResponseMetadata, SignedMsgType, StateId } from '../../proto/generated/platform.js'
import { calculateSignHash } from './calculateSignHash.js'
import { calculateStateIdHash } from './calculateStateIdHash.js'
import { verifySignatureDigest } from 'pshenmic-dpp'

/**
 * Rebuilds Tenderdash precommit of the proof and verifies its BLS signature with given quorum public key.
 * Does not check response freshness or quorum type, use {verifyProofSignature} for a full check
 */
export default async function verifyTenderdashProof (proof: Proof, metadata: ResponseMetadata, rootHash: Uint8Array, quorumPublicKey: Uint8Array): Promise<boolean> {
  const stateId = StateId.create({
    appVersion: String(metadata.protocolVersion),
    coreChainLockedHeight: metadata.coreChainLockedHeight,
    time: metadata.timeMs,
    appHash: rootHash,
    height: metadata.height
  })

  const stateIdHash = await calculateStateIdHash(stateId)

  const commit = CanonicalVote.create({
    type: SignedMsgType.PRECOMMIT,
    blockId: proof.blockIdHash,
    chainId: metadata.chainId,
    height: metadata.height,
    round: String(proof.round),
    stateId: stateIdHash
  })

  const signDigest = await calculateSignHash(
    commit,
    metadata.chainId,
    proof.quorumType,
    proof.quorumHash,
    BigInt(metadata.height),
    proof.round
  )

  const { signature } = proof

  return verifySignatureDigest(Uint8Array.from(signDigest), signature, quorumPublicKey)
}
