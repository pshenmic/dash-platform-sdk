import { GetIdentityKeysRequest, KeyRequestType } from '../../proto/generated/platform.js'
import { IdentifierWASM, IdentityPublicKeyWASM, verifyIdentityKeysByIdentifierProof } from 'pshenmic-dpp'
import { IdentifierLike } from '../types.js'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import {LATEST_PLATFORM_VERSION} from "../constants";

export default async function getIdentityPublicKeys (grpcPool: GRPCConnectionPool, identifier: IdentifierLike, keyIds?: number[]): Promise<IdentityPublicKeyWASM[]> {
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

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  const loadedKeysIds = Object.keys(identity.loadedPublicKeys)

  return loadedKeysIds.map((id) => identity.loadedPublicKeys[id])
}
