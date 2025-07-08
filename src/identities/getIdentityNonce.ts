import {
  GetIdentityNonceRequest, GetIdentityNonceResponse_GetIdentityNonceResponseV0
} from '../../proto/generated/platform'
import { IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'
import { verifyIdentityNonce } from 'wasm-drive-verify'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

const IDENTITY_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityNonce (grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<bigint> {
  const id = new IdentifierWASM(identifier)
  const getIdentityNonceRequest = GetIdentityNonceRequest.fromPartial({
    v0: {
      identityId: id.bytes(),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentityNonce(getIdentityNonceRequest)

  const { proof, metadata } = v0 as GetIdentityNonceResponse_GetIdentityNonceResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    nonce
  } = verifyIdentityNonce(proof.grovedbProof, id.bytes(), true, PlatformVersionWASM.PLATFORM_V8)

  const quorumPublicKey = await getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  if (nonce == null) {
    throw new Error(`Could not get identityNonce for Identity with identifier ${id.base58()}`)
  }

  return BigInt(nonce) & IDENTITY_NONCE_VALUE_FILTER
}
