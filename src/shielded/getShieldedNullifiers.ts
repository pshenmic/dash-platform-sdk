import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedNullifiersRequest } from '../../proto/generated/platform.js'
import { ShieldedNullifierStatus } from '../../types.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedNullifiersProof } from 'pshenmic-dpp'
import {LATEST_PLATFORM_VERSION} from "../constants.js";
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../utils/QueryExecutor.js'

export default async function getShieldedNullifiers (
  grpcPool: GRPCPool,
  nullifiers: Uint8Array[],
  tokenIdentifier?: IdentifierLike
): Promise<ShieldedNullifierStatus[]> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedNullifiersRequest = GetShieldedNullifiersRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        nullifiers,
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest(client => client.getShieldedNullifiers(getShieldedNullifiersRequest))
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {rootHash, nullifiers: nullifiersStatuses} = verifyGroveDBProof(verifyShieldedNullifiersProof, proof.grovedbProof, nullifiers, true, LATEST_PLATFORM_VERSION, tokenId)

      const result = nullifiersStatuses.map(entry => ({
        nullifier: entry.nullifier,
        isSpent: entry.isSpent
      }))

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
