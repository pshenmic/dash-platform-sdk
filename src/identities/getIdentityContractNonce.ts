import {
  GetIdentityContractNonceRequest,
  GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0
} from '../../proto/generated/platform'
import { IdentifierLike } from '../types'
import { IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool'
import { verifyIdentityContractNonce } from 'wasm-drive-verify'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

const IDENTITY_CONTRACT_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityContractNonce (grpcPool: GRPCConnectionPool, identity: IdentifierLike, dataContract: IdentifierLike): Promise<bigint> {
  const identityIdentifier = new IdentifierWASM(identity)
  const dataContractIdentifier = new IdentifierWASM(dataContract)

  const getIdentityContractNonceRequest = GetIdentityContractNonceRequest.fromPartial({
    v0: {
      identityId: identityIdentifier.bytes(),
      contractId: dataContractIdentifier.bytes(),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentityContractNonce(getIdentityContractNonceRequest)

  const { proof, metadata } = v0 as GetIdentityContractNonceResponse_GetIdentityContractNonceResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    nonce: identityContractNonce
  } = verifyIdentityContractNonce(proof.grovedbProof, identityIdentifier.bytes(), dataContractIdentifier.bytes(), true, PlatformVersionWASM.PLATFORM_V9)

  if (identityContractNonce == null) {
    return BigInt(0)
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return BigInt(identityContractNonce) & IDENTITY_CONTRACT_NONCE_VALUE_FILTER
}
