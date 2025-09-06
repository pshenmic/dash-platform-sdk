import {
  GetIdentityByNonUniquePublicKeyHashRequest,
  GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0
} from '../../proto/generated/platform'
import { IdentifierWASM, IdentityWASM, PlatformVersionWASM, verifyIdentifierByNonUniquePublicKeyHashProof } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool'
import hexToBytes from '../utils/hexToBytes'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'
import getIdentityByIdentifier from './getIdentityByIdentifier'

export default async function getIdentityByNonUniquePublicKeyHash (grpcPool: GRPCConnectionPool, hex: string): Promise<IdentityWASM> {
  const getIdentityByNonUniquePublicKeyHashRequest = GetIdentityByNonUniquePublicKeyHashRequest.fromPartial({
    v0: {
      publicKeyHash: hexToBytes(hex),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentityByNonUniquePublicKeyHash(getIdentityByNonUniquePublicKeyHashRequest)

  const { proof, metadata } = v0 as GetIdentityByNonUniquePublicKeyHashResponse_GetIdentityByNonUniquePublicKeyHashResponseV0

  if (proof?.grovedbIdentityPublicKeyHashProof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    rootHash,
    identifier
  } = verifyIdentifierByNonUniquePublicKeyHashProof(proof.grovedbIdentityPublicKeyHashProof.grovedbProof, false, hexToBytes(hex), undefined, PlatformVersionWASM.PLATFORM_V9)

  if (identifier == null) {
    throw new Error(`Identity with non unique public key hash ${hex} not found`)
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.grovedbIdentityPublicKeyHashProof.quorumType, bytesToHex(proof.grovedbIdentityPublicKeyHashProof.quorumHash))

  const verify = verifyTenderdashProof(proof.grovedbIdentityPublicKeyHashProof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return await getIdentityByIdentifier(grpcPool, identifier)
}
