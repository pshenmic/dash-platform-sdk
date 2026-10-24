import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { verifyRecentAddressBalanceChanges, BlockAddressBalanceChanges, PlatformAddressWASM } from 'pshenmic-dpp'
import { GetRecentAddressBalanceChangesRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'

export async function getRecentAddressBalanceChanges (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, startHeight: bigint, startHeightExclusive: boolean = false): Promise<BlockAddressBalanceChanges[]> {
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

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .addGrpcRequest('getRecentAddressBalanceChanges', getRecentAddressBalanceChangesRequest)
    .addProofVerifier(verifyRecentAddressBalanceChanges, startHeight, startHeightExclusive, undefined, true, LATEST_PLATFORM_VERSION)
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
