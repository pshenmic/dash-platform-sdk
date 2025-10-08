import { GetIdentityContractNonceRequest } from '../../proto/generated/platform.js'
import { IdentifierLike } from '../types.js'
import { IdentifierWASM, PlatformVersionWASM, verifyIdentityContractNonceProof } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'

const IDENTITY_CONTRACT_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityContractNonce (grpcPool: GRPCConnectionPool, identity: IdentifierLike, dataContract: IdentifierLike): Promise<bigint> {
  const identityIdentifier = new IdentifierWASM(identity)
  const dataContractIdentifier = new IdentifierWASM(dataContract)

  const getIdentityContractNonceRequest = GetIdentityContractNonceRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        identityId: identityIdentifier.bytes(),
        contractId: dataContractIdentifier.bytes(),
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getIdentityContractNonce(getIdentityContractNonceRequest)

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

  const {
    rootHash,
    contractNonce
  } = verifyIdentityContractNonceProof(proof.grovedbProof, identityIdentifier.bytes(), dataContractIdentifier.bytes(), true, PlatformVersionWASM.PLATFORM_V9)

  if (contractNonce == null) {
    return BigInt(0)
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return BigInt(contractNonce) & IDENTITY_CONTRACT_NONCE_VALUE_FILTER
}
