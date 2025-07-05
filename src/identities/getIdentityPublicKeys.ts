import {
  GetIdentityKeysResponse_GetIdentityKeysResponseV0,
  GetIdentityKeysRequest,
  KeyRequestType
} from '../../proto/generated/platform'
import { IdentifierWASM, IdentityPublicKeyWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'

export default async function getIdentityPublicKeys (grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<IdentityPublicKeyWASM[]> {
  const getIdentityKeysRequest = GetIdentityKeysRequest.fromPartial({
    v0: {
      identityId: (new IdentifierWASM(identifier).bytes()),
      requestType: KeyRequestType.fromPartial({ allKeys: {} })
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentityKeys(getIdentityKeysRequest)

  const { keys } = v0 as GetIdentityKeysResponse_GetIdentityKeysResponseV0
  const { keysBytes } = keys ?? { keysBytes: [] }

  return keysBytes.map((bytes) => IdentityPublicKeyWASM.fromBytes(bytes))
}
