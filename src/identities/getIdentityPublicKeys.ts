import { GetIdentityKeysRequest, KeyRequestType } from '../../proto/generated/platform'
import parseIdentifier from '../utils/parseIdentifier'
import { IdentifierWASM, IdentityPublicKeyWASM } from 'pshenmic-dpp'

export default async function getIdentityPublicKeys (identifier: IdentifierWASM): Promise<IdentityPublicKeyWASM[]> {
  const getIdentityKeysRequest = GetIdentityKeysRequest.fromPartial({
    v0: {
      identityId: parseIdentifier(identifier),
      requestType: KeyRequestType.fromPartial({ allKeys: {} })
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityKeys(getIdentityKeysRequest)

  const { keys } = v0
  const { keysBytes } = keys

  return keysBytes.map((bytes) => this.wasm.IdentityPublicKeyWASM.fromBytes(bytes))
}
