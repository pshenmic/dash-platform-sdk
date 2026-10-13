import { GetIdentityContractNonceRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyIdentityContractNonceProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import verifyProofSignature from '../utils/verifyProofSignature.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

const IDENTITY_CONTRACT_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityContractNonce (grpcPool: GRPCPool, identity: IdentifierLike, dataContract: IdentifierLike): Promise<bigint> {
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
  } = verifyIdentityContractNonceProof(proof.grovedbProof, identityIdentifier.bytes(), dataContractIdentifier.bytes(), true, LATEST_PLATFORM_VERSION)

  if (contractNonce == null) {
    return BigInt(0)
  }

  await verifyProofSignature(grpcPool, proof, metadata, rootHash)

  return BigInt(contractNonce) & IDENTITY_CONTRACT_NONCE_VALUE_FILTER
}
