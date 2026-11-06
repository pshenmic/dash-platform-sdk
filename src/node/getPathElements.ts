import { GetPathElementsRequest } from '../../proto/generated/platform.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { verifyPathElementsProof, VerifiedPathElement } from 'pshenmic-dpp'
import QueryExecutor from '../QueryExecutor.js'

export default async function getPathElements (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  path: Uint8Array[],
  keys: Uint8Array[]
): Promise<VerifiedPathElement[]> {
  const getPathElementsRequest = GetPathElementsRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        path,
        keys,
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getPathElements', getPathElementsRequest)
    // the response without proof returns serialized elements without their keys, they can't be decoded
    .setRequireProof(true)
    .setProofVerifier(verifyPathElementsProof, (_, platformVersion) => [path, keys, platformVersion])
    .mapResponse(data => {
      if (!data.proved) {
        throw new Error('Path elements can only be requested with proof')
      }

      return data.verified.elements
    })
    .execute()
}
