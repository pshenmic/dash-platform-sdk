import { GetIdentityRequest, GetIdentityResponse_GetIdentityResponseV0 } from '../../proto/generated/platform'
import { IdentifierWASM, IdentityWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'

export default async function getIdentityByIdentifier (grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<IdentityWASM> {
  const id = new IdentifierWASM(identifier)
  const getIdentityRequest = GetIdentityRequest.fromPartial({
    v0: {
      id: id.bytes()
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentity(getIdentityRequest)

  const { identity } = v0 as GetIdentityResponse_GetIdentityResponseV0

  if (identity == null) {
    throw new Error(`Identity with identifier ${id.base58()} not found`)
  }

  return IdentityWASM.fromBytes(identity)
}
