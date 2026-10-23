import { GRPCPool } from '../grpcConnectionPool.js'
import { GetTokenTotalSupplyRequest } from '../../proto/generated/platform.js'
import { TokenTotalSupply } from '../../types.js'
import { IdentifierLike, IdentifierWASM, verifyTokenTotalSupplyProof } from 'pshenmic-dpp'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getTokenTotalSupply (grpcPool: GRPCPool, tokenIdentifier: IdentifierLike): Promise<TokenTotalSupply> {
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

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getTokenTotalSupply', getTokenTotalSupplyRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        totalBalance
      } = verifyGroveDBProof(
        verifyTokenTotalSupplyProof,
        proof.grovedbProof,
        tokenId,
        true,
        LATEST_PLATFORM_VERSION
      )

      const result = {
        tokenId,
        totalSystemAmount: totalBalance.tokenSupply,
        totalAggregatedAmountInUserAccounts: totalBalance.aggregatedTokenAccountBalances
      }

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
