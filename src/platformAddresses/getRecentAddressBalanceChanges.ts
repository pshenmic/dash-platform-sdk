import { GRPCPool } from '../grpcConnectionPool.js'
import { verifyRecentAddressBalanceChanges, BlockAddressBalanceChanges, PlatformAddressWASM } from 'pshenmic-dpp'
import { GetRecentAddressBalanceChangesRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION, RECENT_ADDRESS_BALANCE_CHANGES_LIMIT } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'

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
    .addProofVerifier(verifyRecentAddressBalanceChanges, startHeight, startHeightExclusive, RECENT_ADDRESS_BALANCE_CHANGES_LIMIT, true, LATEST_PLATFORM_VERSION)
    .addMapper(data => {
      if (data.proved) {
        return data.verified.blocks
      }

      return data.result.addressBalanceUpdateEntries.blockChanges.map(({ blockHeight, changes }) => ({
        blockHeight: BigInt(blockHeight),
        changes: changes.map(({ address, operation }) => {
          if (operation.oneofKind == null) {
            throw new Error('Unexpected address balance change operation')
          }

          return {
            address: PlatformAddressWASM.fromBytes(address),
            operation: operation.oneofKind === 'setBalance' ? 'setCredits' as const : 'addToCredits' as const,
            credits: BigInt(operation.oneofKind === 'setBalance' ? operation.setBalance : operation.addToBalance)
          }
        })
      }))
    })
    .execute()
}
