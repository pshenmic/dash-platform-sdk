import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedPoolStateRequest } from '../../proto/generated/platform.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedPoolStateProof } from 'pshenmic-dpp'
import {LATEST_PLATFORM_VERSION} from "../constants.js";

export default async function getShieldedPoolState (
  grpcPool: GRPCPool,
  tokenIdentifier?: IdentifierLike
): Promise<bigint | undefined> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedPoolStateRequest = GetShieldedPoolStateRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getShieldedPoolState', getShieldedPoolStateRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {rootHash, totalBalance} = verifyGroveDBProof(verifyShieldedPoolStateProof, proof.grovedbProof, true, LATEST_PLATFORM_VERSION, tokenId)

      const result = totalBalance

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
