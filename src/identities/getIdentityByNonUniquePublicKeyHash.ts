import { GetIdentityByNonUniquePublicKeyHashRequest } from '../../proto/generated/platform.js'
import { IdentityWASM, PlatformVersionWASM, verifyIdentifierByNonUniquePublicKeyHashProof } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import hexToBytes from '../utils/hexToBytes.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import getIdentityByIdentifier from './getIdentityByIdentifier.js'

export default async function getIdentityByNonUniquePublicKeyHash (grpcPool: GRPCConnectionPool, hex: string): Promise<IdentityWASM> {
  const getIdentityByNonUniquePublicKeyHashRequest = GetIdentityByNonUniquePublicKeyHashRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        publicKeyHash: hexToBytes(hex),
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getIdentityByNonUniquePublicKeyHash(getIdentityByNonUniquePublicKeyHashRequest)

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

  if (proof.grovedbIdentityPublicKeyHashProof == null) {
    throw new Error('GroveDB proof not found for identity by non unique public key request')
  }

  const {
    rootHash,
    identifier
  } = verifyIdentifierByNonUniquePublicKeyHashProof(proof.grovedbIdentityPublicKeyHashProof.grovedbProof, false, hexToBytes(hex), undefined, PlatformVersionWASM.PLATFORM_V9)

  if (identifier == null) {
    throw new Error(`Identity with non unique public key hash ${hex} not found`)
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.grovedbIdentityPublicKeyHashProof.quorumType, bytesToHex(proof.grovedbIdentityPublicKeyHashProof.quorumHash))

  const verify = await verifyTenderdashProof(proof.grovedbIdentityPublicKeyHashProof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return await getIdentityByIdentifier(grpcPool, identifier)
}
