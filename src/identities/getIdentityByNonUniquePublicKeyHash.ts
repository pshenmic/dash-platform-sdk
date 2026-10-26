import { GetIdentityByNonUniquePublicKeyHashRequest, GetIdentityByNonUniquePublicKeyHashResponse } from '../../proto/generated/platform.js'
import {
  IdentityWASM,
  PlatformVersionLike,
  PlatformVersionWASM,
  verifyFullIdentityByNonUniquePublicKeyHashProof,
  verifyFullIdentityByNonUniquePublicKeyHashTwoProofs,
  VerifiedFullIdentityByNonUniquePublicKeyHash
} from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import hexToBytes from '../utils/hexToBytes.js'
import QueryExecutor, { ResponseProof } from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

/**
 * Proof of a v0 response, nodes since platform v5.0.0-rc.8 return separate index and identity proofs,
 * older nodes return a single proof
 */
interface NonUniquePublicKeyHashProof extends ResponseProof {
  identityProof?: Uint8Array
  twoProofs: boolean
}

function getNonUniquePublicKeyHashProof ({ version }: GetIdentityByNonUniquePublicKeyHashResponse): NonUniquePublicKeyHashProof {
  if (version.oneofKind !== 'v0') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
  }

  const { result, metadata } = version.v0

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  if (result.oneofKind === 'legacyProof') {
    return { proof: result.legacyProof, metadata, twoProofs: false }
  }

  if (result.oneofKind !== 'proof' || result.proof.grovedbIdentityPublicKeyHashProof == null) {
    throw new Error('Unexpected oneOf type returned from DAPI (must be proof)')
  }

  // the quorum signature is carried by the index proof
  return { proof: result.proof.grovedbIdentityPublicKeyHashProof, metadata, identityProof: result.proof.identityProofBytes, twoProofs: true }
}

function verifyNonUniquePublicKeyHashProof (
  proof: Uint8Array,
  identityProof: Uint8Array | undefined,
  twoProofs: boolean,
  publicKeyHash: Uint8Array,
  queryPlatformVersion: PlatformVersionLike,
  platformVersion: PlatformVersionLike
): VerifiedFullIdentityByNonUniquePublicKeyHash {
  return twoProofs
    ? verifyFullIdentityByNonUniquePublicKeyHashTwoProofs(proof, identityProof, publicKeyHash, undefined, queryPlatformVersion, platformVersion)
    : verifyFullIdentityByNonUniquePublicKeyHashProof(proof, publicKeyHash, undefined, queryPlatformVersion, platformVersion)
}

export default async function getIdentityByNonUniquePublicKeyHash (grpcPool: GRPCPool, hex: string): Promise<IdentityWASM> {
  const getIdentityByNonUniquePublicKeyHashRequest = GetIdentityByNonUniquePublicKeyHashRequest.create({
    version: {
      // v0 is supported by all nodes, v1 only since platform v5.0.0-rc.8
      oneofKind: 'v0',
      v0: {
        publicKeyHash: hexToBytes(hex),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .setGrpcRequest('getIdentityByNonUniquePublicKeyHash', getIdentityByNonUniquePublicKeyHashRequest)
    .setProofExtractor(getNonUniquePublicKeyHashProof)
    .setProofVerifier(verifyNonUniquePublicKeyHashProof, ({ metadata, identityProof, twoProofs }) => [
      identityProof,
      twoProofs,
      hexToBytes(hex),
      metadata.protocolVersion as PlatformVersionWASM,
      LATEST_PLATFORM_VERSION
    ])
    .mapResponse(data => {
      if (data.proved) {
        if (data.verified.identity == null) {
          throw new Error(`Identity with non unique public key hash ${hex} not found`)
        }

        return data.verified.identity
      }

      if (data.result.oneofKind !== 'identity' || data.result.identity.identity == null) {
        throw new Error(`Identity with non unique public key hash ${hex} not found`)
      }

      return IdentityWASM.fromBytes(data.result.identity.identity)
    })
    .execute()
}
