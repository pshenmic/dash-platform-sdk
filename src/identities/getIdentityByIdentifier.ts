import {
  GetIdentityRequest,
  GetIdentityResponse_GetIdentityResponseV0
} from '../../proto/generated/platform'
import { IdentifierWASM, IdentityWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'
import { verifyFullIdentityByIdentityId } from 'wasm-drive-verify'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export default async function getIdentityByIdentifier (grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<IdentityWASM> {
  const id = new IdentifierWASM(identifier)
  const getIdentityRequest = GetIdentityRequest.fromPartial({
    v0: {
      id: id.bytes(),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentity(getIdentityRequest)

  const { proof, metadata } = v0 as GetIdentityResponse_GetIdentityResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    identity
  } = verifyFullIdentityByIdentityId(proof.grovedbProof, true, id.bytes(), PlatformVersionWASM.PLATFORM_V9)

  if (identity == null) {
    throw new Error(`Identity with identifier ${id.base58()} not found`)
  }

  const quorumPublicKey = await getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return IdentityWASM.fromBytes(identity)
}
