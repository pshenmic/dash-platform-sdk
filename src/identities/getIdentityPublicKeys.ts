import { GetIdentityKeysRequest, KeyRequestType } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, IdentityPublicKeyWASM, verifyIdentityKeysByIdentifierProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
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

  // TODO:
  // мапить поля не только под proof
  // переименовать addProof.
  // вынести verifyGroveDBProof внутрь QueryExecutor
  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getIdentityKeys', getIdentityKeysRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        identity
      } = verifyGroveDBProof(verifyIdentityKeysByIdentifierProof, proof.grovedbProof, id.bytes(), keyIds != null ? keyIds : null, false, false, true, null, null, LATEST_PLATFORM_VERSION)

      if (identity == null) {
        throw new Error(`Identity with identifier ${id.base58()} not found`)
      }

      const loadedKeysIds = Object.keys(identity.loadedPublicKeys)

      const result = loadedKeysIds.map((id) => identity.loadedPublicKeys[id])

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
