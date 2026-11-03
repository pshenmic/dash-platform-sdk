import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { GetTokenTotalSupplyRequest } from '../../proto/generated/platform.js'
import { TokenTotalSupply } from '../../types.js'
import { IdentifierLike, IdentifierWASM, verifyTokenTotalSupplyProof } from 'pshenmic-dpp'
import QueryExecutor from '../QueryExecutor.js'

export default async function getTokenTotalSupply (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, tokenIdentifier: IdentifierLike): Promise<TokenTotalSupply> {
  const tokenId = new IdentifierWASM(tokenIdentifier)

  const getTokenTotalSupplyRequest = GetTokenTotalSupplyRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        tokenId: (tokenId).bytes(),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getTokenTotalSupply', getTokenTotalSupplyRequest)
    .setProofVerifier(verifyTokenTotalSupplyProof, (_, platformVersion) => [tokenId, true, platformVersion])
    .mapResponse(data => {
      const [totalSystemAmount, totalAggregatedAmountInUserAccounts] = data.proved
        ? [data.verified.totalBalance.tokenSupply, data.verified.totalBalance.aggregatedTokenAccountBalances]
        : [BigInt(data.result.tokenTotalSupply.totalSystemAmount), BigInt(data.result.tokenTotalSupply.totalAggregatedAmountInUserAccounts)]

      return {
        tokenId,
        totalSystemAmount,
        totalAggregatedAmountInUserAccounts
      }
    })
    .execute()
}
