import { GetIdentityKeysRequest, GetIdentityRequest, KeyRequestType } from '../../proto/generated/platform'
import parseIdentifier from '../utils/parseIdentifier'
import { IdentityWASM } from 'pshenmic-dpp'

export default async function getByIdentifier (identifier) {
  const getIdentityRequest = new GetIdentityRequest.fromPartial({
    v0: {
      id: parseIdentifier(identifier),
    }
  })

  const { v0 } = await this.client.getIdentity(getIdentityRequest)

  const { identity } = v0

  if (!identity) {
    throw new Error(`Identity with identifier ${identifier} not found`)
  }

  return IdentityWASM.fromBytes(identity)
}
