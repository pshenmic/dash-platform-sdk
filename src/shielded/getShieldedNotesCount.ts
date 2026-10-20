import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedNotesCountRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedNotesCountProof } from 'pshenmic-dpp'
import {LATEST_PLATFORM_VERSION} from "../constants.js";
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../utils/QueryExecutor.js'

export default async function getShieldedNotesCount (
  grpcPool: GRPCPool,
  tokenIdentifier?: IdentifierLike
): Promise<bigint | undefined> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedNotesCountRequest = GetShieldedNotesCountRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest(client => client.getShieldedNotesCount(getShieldedNotesCountRequest))
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {rootHash, count} = verifyGroveDBProof(verifyShieldedNotesCountProof, proof.grovedbProof, true, LATEST_PLATFORM_VERSION, tokenId)

      const result = count

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
