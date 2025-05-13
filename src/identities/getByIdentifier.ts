import { GetIdentityRequest } from '../../proto/generated/platform'
import parseIdentifier from '../utils/parseIdentifier'
import { IdentifierWASM, IdentityWASM } from 'pshenmic-dpp'

export default async function getByIdentifier (identifier: IdentifierWASM): Promise<IdentityWASM> {
  const getIdentityRequest = GetIdentityRequest.fromPartial({
    v0: {
      id: parseIdentifier(identifier)
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentity(getIdentityRequest)

  const { identity } = v0

  if (identity == null) {
    throw new Error(`Identity with identifier ${identifier.base58()} not found`)
  }

  return IdentityWASM.fromBytes(identity)
}
