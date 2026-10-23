import { GRPCPool } from '../grpcConnectionPool.js'
import { verifyRecentCompactedAddressBalanceChanges, CompactedBlockAddressBalanceChanges } from 'pshenmic-dpp'
import { GetRecentCompactedAddressBalanceChangesRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'

export async function getRecentCompactedAddressBalanceChanges (grpcPool: GRPCPool, startBlockHeight: bigint): Promise<CompactedBlockAddressBalanceChanges[]> {
  const getRecentCompactedAddressBalanceChangesRequest = GetRecentCompactedAddressBalanceChangesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        startBlockHeight: startBlockHeight.toString(),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getRecentCompactedAddressBalanceChanges', getRecentCompactedAddressBalanceChangesRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const { rootHash, ranges } = verifyGroveDBProof(verifyRecentCompactedAddressBalanceChanges, proof.grovedbProof, startBlockHeight, undefined, LATEST_PLATFORM_VERSION)

      const result = ranges

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
