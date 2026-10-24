import { GRPCPool } from '../grpcConnectionPool.js'
import { TokenDirectPurchasePrices } from '../../types.js'
import { IdentifierLike, IdentifierWASM, verifyTokenDirectPurchasePrices, TokenPricingScheduleWASM } from 'pshenmic-dpp'
import QueryExecutor from '../QueryExecutor.js'
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
    .addProofVerifier(verifyTokenDirectPurchasePrices, tokenIds, true, LATEST_PLATFORM_VERSION)
    .addMapper(data => {
      if (data.proved) {
        if (data.verified.prices == null) {
          throw new Error('Prices not found')
        }

        return data.verified.prices
      }

      return data.result.tokenDirectPurchasePrices.tokenDirectPurchasePrice.map(({ tokenId, price }) => {
        let pricingSchedule: TokenPricingScheduleWASM | undefined

        if (price.oneofKind === 'fixedPrice') {
          pricingSchedule = TokenPricingScheduleWASM.SinglePrice(BigInt(price.fixedPrice))
        } else if (price.oneofKind === 'variablePrice') {
          pricingSchedule = TokenPricingScheduleWASM.SetPrices(Object.fromEntries(price.variablePrice.priceForQuantity
            .map(({ quantity, price }) => [quantity, BigInt(price)])))
        }

        return { tokenId: new IdentifierWASM(tokenId), pricingSchedule }
      })
    })
    .execute()
}
