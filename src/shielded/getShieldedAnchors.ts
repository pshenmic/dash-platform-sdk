import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedAnchorsRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedAnchorsProof } from 'pshenmic-dpp'
import {LATEST_PLATFORM_VERSION} from "../constants.js";
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../utils/QueryExecutor.js'

export default async function getShieldedAnchors (
  grpcPool: GRPCPool,
  tokenIdentifier?: IdentifierLike
): Promise<Uint8Array[]> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedAnchorsRequest = GetShieldedAnchorsRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest(client => client.getShieldedAnchors(getShieldedAnchorsRequest))
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {rootHash, anchors} = verifyGroveDBProof(verifyShieldedAnchorsProof, proof.grovedbProof, true, LATEST_PLATFORM_VERSION, tokenId)

      const result = anchors

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
