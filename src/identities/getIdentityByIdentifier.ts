import { GetIdentityRequest } from '../../proto/generated/platform'
import { IdentifierWASM, IdentityWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'

export default async function getIdentityByIdentifier (identifier: IdentifierLike): Promise<IdentityWASM> {
  const id = new IdentifierWASM(identifier)
  const getIdentityRequest = GetIdentityRequest.fromPartial({
    v0: {
      id: id.bytes()
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentity(getIdentityRequest)

  const { identity } = v0

  if (identity == null) {
    throw new Error(`Identity with identifier ${id.base58()} not found`)
  }

  return IdentityWASM.fromBytes(identity)
}
