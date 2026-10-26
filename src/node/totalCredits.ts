import { GetTotalCreditsInPlatformRequest } from '../../proto/generated/platform.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import {
  HALVING_INTERVAL,
  LATEST_PLATFORM_VERSION,
  MAINNET_ACTIVATION_HEIGHT,
  TESTNET_ACTIVATION_HEIGHT
} from '../constants.js'
import { verifyTotalCreditsProof } from 'pshenmic-dpp'
import QueryExecutor from '../QueryExecutor.js'

export default async function totalCredits (grpcPool: GRPCPool): Promise<bigint> {
  const getTotalCreditsInPlatformRequest = GetTotalCreditsInPlatformRequest.create({
    version: {
      oneofKind: 'v0',
      v0: { prove: true }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .setGrpcRequest('getTotalCreditsInPlatform', getTotalCreditsInPlatformRequest)
    .setProofVerifier(verifyTotalCreditsProof, ({ metadata }) => {
      const activationHeight = grpcPool.network === 'testnet' ? TESTNET_ACTIVATION_HEIGHT : MAINNET_ACTIVATION_HEIGHT

      return [HALVING_INTERVAL, activationHeight, metadata.coreChainLockedHeight, LATEST_PLATFORM_VERSION]
    })
    .mapResponse(data => data.proved ? data.verified.totalCredits : BigInt(data.result.credits))
    .execute()
}
