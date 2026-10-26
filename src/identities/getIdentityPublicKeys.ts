import { GetIdentityKeysRequest, KeyRequestType } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, IdentityPublicKeyWASM, verifyIdentityKeysByIdentifierProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import QueryExecutor from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getIdentityPublicKeys (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, identifier: IdentifierLike, keyIds?: number[]): Promise<IdentityPublicKeyWASM[]> {
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

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getIdentityKeys', getIdentityKeysRequest)
    .setProofVerifier(verifyIdentityKeysByIdentifierProof, id.bytes(), keyIds ?? null, false, false, true, null, null, LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      const keys = data.proved
        ? data.verified.identity?.loadedPublicKeys
        : data.result.keys.keysBytes.map(bytes => IdentityPublicKeyWASM.fromBytes(bytes))

      if (keys == null) {
        throw new Error(`Identity with identifier ${id.base58()} not found`)
      }

      return Object.values(keys)
    })
    .execute()
}
