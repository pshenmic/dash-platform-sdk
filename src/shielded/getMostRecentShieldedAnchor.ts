import { GRPCPool } from '../grpcConnectionPool.js'
import { GetMostRecentShieldedAnchorRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyMostRecentShieldedAnchorProof } from 'pshenmic-dpp'
import {LATEST_PLATFORM_VERSION} from "../constants.js";
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'

export default async function getMostRecentShieldedAnchor (
  grpcPool: GRPCPool,
  tokenIdentifier?: IdentifierLike
): Promise<Uint8Array | undefined> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getMostRecentShieldedAnchorRequest = GetMostRecentShieldedAnchorRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getMostRecentShieldedAnchor', getMostRecentShieldedAnchorRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {rootHash, anchor} = verifyGroveDBProof(verifyMostRecentShieldedAnchorProof, proof.grovedbProof, true, LATEST_PLATFORM_VERSION, tokenId)

      const result = anchor

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
