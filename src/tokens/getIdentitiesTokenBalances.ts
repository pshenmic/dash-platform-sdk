import { GRPCPool } from '../grpcConnectionPool.js'
import { GetIdentitiesTokenBalancesRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyTokenBalancesForIdentitiesProof } from 'pshenmic-dpp'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export interface IdentitiesTokenBalances {
  identityId: IdentifierWASM
  balance?: bigint | undefined
}

export default async function getIdentitiesTokenBalances (grpcPool: GRPCPool, identifiers: IdentifierLike[], tokenIdentifier: IdentifierLike): Promise<IdentitiesTokenBalances[]> {
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

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getIdentitiesTokenBalances', getIdentitiesTokenBalancesRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        balances
      } = verifyGroveDBProof(
        verifyTokenBalancesForIdentitiesProof,
        proof.grovedbProof,
        tokenId,
        true,
        ids,
        LATEST_PLATFORM_VERSION
      )

      const result = balances
        .map(({ id, balance }) => ({
          identityId: new IdentifierWASM(id),
          balance
        }))

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
