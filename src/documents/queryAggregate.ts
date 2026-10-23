import {
  AggregateProofQuery,
  IdentifierLike,
  IdentifierWASM,
  ProvenAggregate,
  verifyDocumentsAverageProof,
  verifyDocumentsCountProof,
  verifyDocumentsSumProof
} from 'pshenmic-dpp'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor from '../QueryExecutor.js'
import { createDocumentsV1Request, getDocumentsV1Proof, toOrderClauses, toSelect, toWhereClauses } from './v1.js'

export type DocumentsAggregateFunction = 'count' | 'sum' | 'avg'

export default async function queryAggregate (
  grpcPool: GRPCPool,
  dataContractId: IdentifierLike,
  aggregateFunction: DocumentsAggregateFunction,
  query: AggregateProofQuery,
  field?: string
): Promise<ProvenAggregate> {
  if (aggregateFunction !== 'count' && field == null) {
    throw new Error(`Field is required for ${aggregateFunction} query`)
  }

  const dataContract = await getDataContractByIdentifier(grpcPool, dataContractId)

  const request = createDocumentsV1Request({
    dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
    documentType: query.documentTypeName,
    whereClauses: toWhereClauses(query.where),
    orderBy: toOrderClauses(query.orderBy),
    limit: query.limit,
    selects: toSelect({ function: aggregateFunction, field }),
    groupBy: query.groupBy ?? []
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getDocuments', request)
    .addProof(response => {
      const { proof, metadata } = getDocumentsV1Proof(response)

      const metadataTimeMs = BigInt(metadata.timeMs)

      let verified

      if (aggregateFunction === 'count') {
        verified = verifyGroveDBProof(verifyDocumentsCountProof, proof.grovedbProof, dataContract, query, LATEST_PLATFORM_VERSION, metadataTimeMs)
      } else if (aggregateFunction === 'sum') {
        verified = verifyGroveDBProof(verifyDocumentsSumProof, proof.grovedbProof, dataContract, query, field as string, LATEST_PLATFORM_VERSION, metadataTimeMs)
      } else {
        verified = verifyGroveDBProof(verifyDocumentsAverageProof, proof.grovedbProof, dataContract, query, field as string, LATEST_PLATFORM_VERSION, metadataTimeMs)
      }

      return { result: verified.value, rootHash: verified.rootHash, proof, metadata }
    })
    .execute()
}
