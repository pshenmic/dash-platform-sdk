import { GetIdentityKeysRequest, KeyRequestType } from '../../proto/generated/platform'
import { IdentifierWASM, IdentityPublicKeyWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'

export default async function getIdentityPublicKeys (identifier: IdentifierLike): Promise<IdentityPublicKeyWASM[]> {
  const getIdentityKeysRequest = GetIdentityKeysRequest.fromPartial({
    v0: {
      identityId: (new IdentifierWASM(identifier).bytes()),
      requestType: KeyRequestType.fromPartial({ allKeys: {} })
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityKeys(getIdentityKeysRequest)

  const { keys } = v0
  const { keysBytes } = keys

  return keysBytes.map((bytes) => this.dpp.IdentityPublicKeyWASM.fromBytes(bytes))
}
