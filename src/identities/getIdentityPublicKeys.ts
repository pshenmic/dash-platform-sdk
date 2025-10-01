import { GetIdentityKeysRequest, KeyRequestType } from '../../proto/generated/platform'
import { IdentifierWASM, IdentityPublicKeyWASM, PlatformVersionWASM, verifyIdentityKeysByIdentifierProof } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export default async function getIdentityPublicKeys (grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<IdentityPublicKeyWASM[]> {
  const id = new IdentifierWASM(identifier)

  const getIdentityKeysRequest = GetIdentityKeysRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        identityId: id.bytes(),
        requestType: KeyRequestType.create({
          request: {
            oneofKind: 'allKeys',
            allKeys: {}
          }
        }),
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getIdentityKeys(getIdentityKeysRequest)

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
    identity
  } = verifyIdentityKeysByIdentifierProof(proof.grovedbProof, id.bytes(), null, false, false, true, null, null, PlatformVersionWASM.PLATFORM_V9)

  if (identity == null) {
    throw new Error(`Identity with identifier ${id.base58()} not found`)
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  const loadedKeysIds = Object.keys(identity.loadedPublicKeys)

  return loadedKeysIds.map((id) => identity.loadedPublicKeys[id])
}
