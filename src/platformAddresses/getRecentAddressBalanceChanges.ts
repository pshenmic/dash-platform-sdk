import { GRPCPool } from '../grpcConnectionPool.js'
import { verifyRecentAddressBalanceChanges, BlockAddressBalanceChanges } from 'pshenmic-dpp'
import { GetRecentAddressBalanceChangesRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'

export async function getRecentAddressBalanceChanges (grpcPool: GRPCPool, startHeight: bigint, startHeightExclusive: boolean = false): Promise<BlockAddressBalanceChanges[]> {
  const getRecentAddressBalanceChangesRequest = GetRecentAddressBalanceChangesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        startHeight: startHeight.toString(),
        prove: true,
        startHeightExclusive
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getRecentAddressBalanceChanges', getRecentAddressBalanceChangesRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const { rootHash, blocks } = verifyGroveDBProof(verifyRecentAddressBalanceChanges, proof.grovedbProof, startHeight, startHeightExclusive, undefined, true, LATEST_PLATFORM_VERSION)

      const result = blocks

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
