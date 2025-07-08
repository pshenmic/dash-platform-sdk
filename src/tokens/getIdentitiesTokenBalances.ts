import GRPCConnectionPool from '../grpcConnectionPool'
import {
  GetIdentitiesTokenBalancesRequest,
  GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0,
  GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances
} from '../../proto/generated/platform'
import { IdentifierLike } from '../types'
import { IdentifierWASM } from 'pshenmic-dpp'

export interface IdentitiesTokenBalances {
  identityId: IdentifierWASM
  balance?: string | undefined
}

export default async function getIdentitiesTokenBalances (grpcPool: GRPCConnectionPool, identifiers: IdentifierLike[], tokenIdentifier: IdentifierLike): Promise<IdentitiesTokenBalances[]> {
  const ids = identifiers.map(identifier => new IdentifierWASM(identifier))
  const tokenId = new IdentifierWASM(tokenIdentifier)

  const request = GetIdentitiesTokenBalancesRequest.fromPartial({
    v0: {
      tokenId: tokenId.bytes(),
      identityIds: ids.map(id => id.bytes())
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentitiesTokenBalances(request)

  const { identityTokenBalances } = v0 as GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0

  return (identityTokenBalances as GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0_IdentityTokenBalances)
    .identityTokenBalances
    .map((identityTokenBalance) => ({
      identityId: new IdentifierWASM(identityTokenBalance.identityId),
      balance: identityTokenBalance.balance
    }))
}
