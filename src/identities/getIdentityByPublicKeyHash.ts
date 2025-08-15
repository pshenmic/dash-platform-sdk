import {
  GetIdentityByPublicKeyHashRequest,
  GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0
} from '../../proto/generated/platform'
import { IdentityWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool'
import hexToBytes from '../utils/hexToBytes'
import { verifyFullIdentityByUniquePublicKeyHash } from 'wasm-drive-verify'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export default async function getIdentityByPublicKeyHash (grpcPool: GRPCConnectionPool, hex: string): Promise<IdentityWASM> {
  const getIdentityByPublicKeyHashRequest = GetIdentityByPublicKeyHashRequest.fromPartial({
    v0: {
      publicKeyHash: hexToBytes(hex),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentityByPublicKeyHash(getIdentityByPublicKeyHashRequest)

  const { proof, metadata } = v0 as GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    identity
  } = verifyFullIdentityByUniquePublicKeyHash(proof.grovedbProof, hexToBytes(hex), PlatformVersionWASM.PLATFORM_V9)

  if (identity == null) {
    throw new Error(`Identity with public key hash ${hex} not found`)
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return IdentityWASM.fromBytes(identity)
}
