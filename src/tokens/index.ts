import GRPCConnectionPool from '../grpcConnectionPool'
import { IdentifierLike } from '../types'
import getIdentitiesTokenBalances, { IdentitiesTokenBalances } from './getIdentitiesTokenBalances'
import getIdentityTokensBalances, { IdentityTokenBalances } from './getIdentityTokensBalances'
import getTokenContractInfo, { TokenContractInfo } from './getTokenContractInfo'
import getTokenTotalSupply, { TokenTotalSupply } from './getTokenTotalSupply'

export default class TokensController {
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  async getIdentitiesTokenBalances (identifiers: IdentifierLike[], tokenIdentifier: IdentifierLike): Promise<IdentitiesTokenBalances[]> {
    return await getIdentitiesTokenBalances(this.grpcPool, identifiers, tokenIdentifier)
  }

  async getIdentityTokensBalances (identifier: IdentifierLike, tokenIdentifiers: IdentifierLike[]): Promise<IdentityTokenBalances[]> {
    return await getIdentityTokensBalances(this.grpcPool, identifier, tokenIdentifiers)
  }

  async getTokenContractInfo (tokenIdentifier: IdentifierLike): Promise<TokenContractInfo> {
    return await getTokenContractInfo(this.grpcPool, tokenIdentifier)
  }

  async getTokenTotalSupply (tokenIdentifier: IdentifierLike): Promise<TokenTotalSupply> {
    return await getTokenTotalSupply(this.grpcPool, tokenIdentifier)
  }
}
