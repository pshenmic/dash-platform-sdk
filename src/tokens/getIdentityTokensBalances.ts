import { GRPCPool } from '../grpcConnectionPool.js'
import { IdentifierLike, IdentifierWASM, verifyTokensBalancesForIdentityProof } from 'pshenmic-dpp'
import { GetIdentityTokenBalancesRequest } from '../../proto/generated/platform.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export interface IdentityTokenBalances {
  tokenId: IdentifierWASM
  balance?: bigint | undefined
}

export default async function getIdentityTokensBalances (grpcPool: GRPCPool, identifier: IdentifierLike, tokenIdentifiers: IdentifierLike[]): Promise<IdentityTokenBalances[]> {
  const id = new IdentifierWASM(identifier)
  const tokenIds = tokenIdentifiers.map(tokenIdentifier => new IdentifierWASM(tokenIdentifier))

  const getIdentityTokenBalancesRequest = GetIdentityTokenBalancesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        tokenIds: tokenIds.map((identifier) => identifier.bytes()),
        identityId: id.bytes(),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getIdentityTokenBalances', getIdentityTokenBalancesRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        balances
      } = verifyGroveDBProof(
        verifyTokensBalancesForIdentityProof,
        proof.grovedbProof,
        tokenIds,
        id,
        true,
        LATEST_PLATFORM_VERSION
      )

      const result = balances
        .map(({ id, balance }) => ({
          tokenId: new IdentifierWASM(id),
          balance
        }))

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
