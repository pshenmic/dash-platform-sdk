import { GetIdentityKeysRequest, KeyRequestType } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, IdentityPublicKeyWASM, verifyIdentityKeysByIdentifierProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import verifyProofSignature from '../utils/verifyProofSignature.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getIdentityPublicKeys (grpcPool: GRPCPool, identifier: IdentifierLike, keyIds?: number[]): Promise<IdentityPublicKeyWASM[]> {
  const id = new IdentifierWASM(identifier)

  let requestType: KeyRequestType = {
    request: {
      oneofKind: 'allKeys',
      allKeys: {}
    }
  }

  if (keyIds != null) {
    requestType = {
      request: {
        oneofKind: 'specificKeys',
        specificKeys: { keyIds }
      }
    }
  }

  const getIdentityKeysRequest = GetIdentityKeysRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        identityId: id.bytes(),
        requestType: KeyRequestType.create(requestType),
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
  } = verifyIdentityKeysByIdentifierProof(proof.grovedbProof, id.bytes(), keyIds != null ? keyIds : null, false, false, true, null, null, LATEST_PLATFORM_VERSION)

  if (identity == null) {
    throw new Error(`Identity with identifier ${id.base58()} not found`)
  }

  await verifyProofSignature(grpcPool, proof, metadata, rootHash)

  const loadedKeysIds = Object.keys(identity.loadedPublicKeys)

  return loadedKeysIds.map((id) => identity.loadedPublicKeys[id])
}
