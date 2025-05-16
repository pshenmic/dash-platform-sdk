import { GetIdentityRequest } from '../../proto/generated/platform'
import { IdentifierWASM, IdentityWASM } from 'pshenmic-dpp'

export default async function getByIdentifier (identifier: string): Promise<IdentityWASM> {
  const getIdentityRequest = GetIdentityRequest.fromPartial({
    v0: {
      id: (new IdentifierWASM(identifier)).bytes()
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentity(getIdentityRequest)

  const { identity } = v0

  if (identity == null) {
    throw new Error(`Identity with identifier ${new IdentifierWASM(identifier).base58()} not found`)
  }

  return IdentityWASM.fromBytes(identity)
}
