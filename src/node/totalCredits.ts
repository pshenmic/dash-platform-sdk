import { GetTotalCreditsInPlatformRequest } from '../../proto/generated/platform.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import {
  HALVING_INTERVAL,
  LATEST_PLATFORM_VERSION,
  MAINNET_ACTIVATION_HEIGHT,
  TESTNET_ACTIVATION_HEIGHT
} from '../constants.js'
import { verifyTotalCreditsProof } from 'pshenmic-dpp'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'

export default async function totalCredits (grpcPool: GRPCPool): Promise<bigint> {
  const getTotalCreditsInPlatformRequest = GetTotalCreditsInPlatformRequest.create({
    version: {
      oneofKind: 'v0',
      v0: { prove: true }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getTotalCreditsInPlatform', getTotalCreditsInPlatformRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const activationHeight = grpcPool.network === 'testnet' ? TESTNET_ACTIVATION_HEIGHT : MAINNET_ACTIVATION_HEIGHT

      const { rootHash, totalCredits } = verifyGroveDBProof(
        verifyTotalCreditsProof,
        proof.grovedbProof,
        HALVING_INTERVAL,
        activationHeight,
        Number(metadata.height),
        LATEST_PLATFORM_VERSION
      )

      const result = totalCredits

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
