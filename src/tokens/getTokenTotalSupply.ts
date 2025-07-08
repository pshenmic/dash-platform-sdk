import GRPCConnectionPool from '../grpcConnectionPool'
import {
  GetTokenTotalSupplyRequest,
  GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0
} from '../../proto/generated/platform'
import { IdentifierLike } from '../types'
import { IdentifierWASM } from 'pshenmic-dpp'

export interface TokenTotalSupply {
  tokenId: IdentifierWASM
  totalSystemAmount: string
  totalAggregatedAmountInUserAccounts: string
}

export default async function getTokenTotalSupply (grpcPool: GRPCConnectionPool, tokenIdentifier: IdentifierLike): Promise<TokenTotalSupply> {
  const tokenId = new IdentifierWASM(tokenIdentifier)

  const request = GetTokenTotalSupplyRequest.fromPartial({
    v0: {
      tokenId: (tokenId).bytes()
    }
  })

  const { v0 } = await grpcPool.getClient().getTokenTotalSupply(request)

  const { tokenTotalSupply } = v0 as GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0

  if (tokenTotalSupply == null) {
    throw new Error(`Token with identifier ${tokenId.base58()} not found`)
  }

  return {
    tokenId: new IdentifierWASM(tokenTotalSupply.tokenId),
    totalSystemAmount: tokenTotalSupply.totalSystemAmount,
    totalAggregatedAmountInUserAccounts: tokenTotalSupply.totalAggregatedAmountInUserAccounts
  }
}
