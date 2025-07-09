import { CanonicalVote, Proof, ResponseMetadata, SignedMsgType, StateId } from '../../proto/generated/platform'
import { calculateSignHash } from './calculateSignHash'
import { calculateStateIdHash } from './calculateStateIdHash'
import verifyBls from './verifyBls'
import hexToBytes from "./hexToBytes";

export default function verifyTenderdashProof (proof: Proof, metadata: ResponseMetadata, rootHash: Uint8Array, quorumPublicKey: string): boolean {
  const stateId = StateId.fromPartial({
    appVersion: String(metadata.protocolVersion),
    coreChainLockedHeight: metadata.coreChainLockedHeight,
    time: metadata.timeMs,
    appHash: rootHash,
    height: metadata.height
  })

  const stateIdHash = calculateStateIdHash(stateId)

  const commit = CanonicalVote.fromPartial({
    type: SignedMsgType.PRECOMMIT,
    blockId: proof.blockIdHash,
    chainId: metadata.chainId,
    height: metadata.height,
    round: String(proof.round),
    stateId: stateIdHash
  })

  const signDigest = calculateSignHash(
    commit,
    metadata.chainId,
    proof.quorumType,
    proof.quorumHash,
    BigInt(metadata.height),
    proof.round
  )

  const { signature } = proof

  return verifyBls(hexToBytes(quorumPublicKey), Uint8Array.from(signDigest), signature)
}
