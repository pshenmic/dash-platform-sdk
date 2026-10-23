import { GRPCPool } from '../grpcConnectionPool.js'
import { TokenDirectPurchasePrices } from '../../types.js'
import { IdentifierLike, IdentifierWASM, verifyTokenDirectPurchasePrices } from 'pshenmic-dpp'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
import { GetTokenDirectPurchasePricesRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getTokenDirectPurchasePrices (grpcPool: GRPCPool, tokenIdentifiers: IdentifierLike[]): Promise<TokenDirectPurchasePrices[]> {
  const tokenIds = tokenIdentifiers.map(tokenId => new IdentifierWASM(tokenId).bytes())

  const request = GetTokenDirectPurchasePricesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        tokenIds,
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getTokenDirectPurchasePrices', request)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const { rootHash, prices } = verifyGroveDBProof(
        verifyTokenDirectPurchasePrices,
        proof.grovedbProof,
        tokenIds,
        true,
        LATEST_PLATFORM_VERSION
      )

      if (prices == null) {
        throw new Error('Prices not found')
      }

      const result = prices

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
