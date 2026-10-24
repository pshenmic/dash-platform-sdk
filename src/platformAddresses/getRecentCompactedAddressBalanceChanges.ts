import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { verifyRecentCompactedAddressBalanceChanges, CompactedBlockAddressBalanceChanges, PlatformAddressWASM } from 'pshenmic-dpp'
import { GetRecentCompactedAddressBalanceChangesRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'

export async function getRecentCompactedAddressBalanceChanges (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, startBlockHeight: bigint): Promise<CompactedBlockAddressBalanceChanges[]> {
  const getRecentCompactedAddressBalanceChangesRequest = GetRecentCompactedAddressBalanceChangesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        startBlockHeight: startBlockHeight.toString(),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .addGrpcRequest('getRecentCompactedAddressBalanceChanges', getRecentCompactedAddressBalanceChangesRequest)
    .addProofVerifier(verifyRecentCompactedAddressBalanceChanges, startBlockHeight, undefined, LATEST_PLATFORM_VERSION)
    .addMapper(data => {
      if (data.proved) {
        return data.verified.ranges
      }

      return data.result.compactedAddressBalanceUpdateEntries.compactedBlockChanges.map(({ startBlockHeight, endBlockHeight, changes }) => ({
        startBlockHeight: BigInt(startBlockHeight),
        endBlockHeight: BigInt(endBlockHeight),
        changes: changes.map(({ address, operation }) => {
          if (operation.oneofKind == null) {
            throw new Error('Unexpected address balance change operation')
          }

          return {
            address: PlatformAddressWASM.fromBytes(address),
            operation: operation.oneofKind,
            setCredits: operation.oneofKind === 'setCredits' ? BigInt(operation.setCredits) : undefined,
            addToCreditsOperations: operation.oneofKind === 'addToCreditsOperations'
              ? operation.addToCreditsOperations.entries.map(({ blockHeight, credits }) => ({ blockHeight: BigInt(blockHeight), credits: BigInt(credits) }))
              : []
          }
        })
      }))
    })
    .execute()
}
