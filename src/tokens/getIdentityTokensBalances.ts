import GRPCConnectionPool from "../grpcConnectionPool";
import {IdentifierLike} from "../types";
import {IdentifierWASM} from "pshenmic-dpp";
import {
  GetIdentityTokenBalancesRequest,
  GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0,
  GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances
} from "../../proto/generated/platform";

export interface IdentityTokenBalances {
  tokenId: IdentifierWASM;
  balance?: string | undefined;
}

export default async function getIdentityTokensBalances(grpcPool: GRPCConnectionPool, identifier: IdentifierLike, tokenIdentifiers: IdentifierLike[]): Promise<IdentityTokenBalances[]> {
  const id = new IdentifierWASM(identifier);
  const tokenIds = tokenIdentifiers.map(tokenIdentifier => new IdentifierWASM(tokenIdentifier));

  const request = GetIdentityTokenBalancesRequest.fromPartial({
    v0: {
      tokenIds: tokenIds.map((identifier) => identifier.bytes()),
      identityId: id.bytes()
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentityTokenBalances(request);

  const { tokenBalances } = v0 as GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0

  return (tokenBalances as GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0_TokenBalances)
    .tokenBalances
    .map((tokenBalance) => ({
      tokenId: new IdentifierWASM(tokenBalance.tokenId),
      balance: tokenBalance.balance
    }))
}