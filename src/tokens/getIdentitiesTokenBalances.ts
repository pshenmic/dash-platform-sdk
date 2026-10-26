import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { GetIdentitiesTokenBalancesRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyTokenBalancesForIdentitiesProof } from 'pshenmic-dpp'
import QueryExecutor from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export interface IdentitiesTokenBalances {
  identityId: IdentifierWASM
  balance?: bigint | undefined
}

export default async function getIdentitiesTokenBalances (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, identifiers: IdentifierLike[], tokenIdentifier: IdentifierLike): Promise<IdentitiesTokenBalances[]> {
  const ids = identifiers.map(identifier => new IdentifierWASM(identifier))
  const tokenId = new IdentifierWASM(tokenIdentifier)

  const getIdentitiesTokenBalancesRequest = GetIdentitiesTokenBalancesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        tokenId: tokenId.bytes(),
        identityIds: ids.map(id => id.bytes()),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getIdentitiesTokenBalances', getIdentitiesTokenBalancesRequest)
    .setProofVerifier(verifyTokenBalancesForIdentitiesProof, tokenId, true, ids, LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      const balances = data.proved
        ? data.verified.balances
        : data.result.identityTokenBalances.identityTokenBalances
          .map(({ identityId, balance }) => ({ id: identityId, balance: balance != null ? BigInt(balance) : undefined }))

      return balances
        .map(({ id, balance }) => ({
          identityId: new IdentifierWASM(id),
          balance
        }))
    })
    .execute()
}
