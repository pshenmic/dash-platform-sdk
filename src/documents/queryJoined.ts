import {
  CompositeSubQuery,
  DocumentsQuery,
  IdentifierLike,
  IdentifierWASM,
  verifyChainedDocumentsProof,
  verifyCompositeDocumentsProof,
  VerifiedChainedDocuments,
  VerifiedCompositeDocuments
} from 'pshenmic-dpp'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor from '../utils/QueryExecutor.js'
import { createDocumentsV1Request, getDocumentsV1Proof, toOrderClauses, toStart, toSubQueries, toWhereClauses } from './v1.js'

export type ChainedDocuments = Omit<VerifiedChainedDocuments, 'rootHash'>
export type CompositeDocuments = Omit<VerifiedCompositeDocuments, 'rootHash'>

/**
 * Chained join: documents of `query`, then the documents of `outerDocumentTypeName`
 * their `joinProperty` refers to
 */
export async function queryChained (
  grpcPool: GRPCPool,
  dataContractId: IdentifierLike,
  query: DocumentsQuery,
  joinProperty: string,
  outerDocumentTypeName: string
): Promise<ChainedDocuments> {
  const dataContract = await getDataContractByIdentifier(grpcPool, dataContractId)

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest(client => client.getDocuments(createDocumentsV1Request({
      dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
      documentType: query.documentTypeName,
      whereClauses: toWhereClauses(query.where),
      orderBy: toOrderClauses(query.orderBy),
      limit: query.limit,
      start: toStart(query.startAt, query.startAtIncluded),
      chained: { joinProperty, outerDocumentType: outerDocumentTypeName }
    })))
    .addProof(response => {
      const { proof, metadata } = getDocumentsV1Proof(response)

      const { rootHash, ...result } = verifyGroveDBProof(verifyChainedDocumentsProof, proof.grovedbProof, dataContract, query, joinProperty, outerDocumentTypeName, LATEST_PLATFORM_VERSION)

      return { result, rootHash, proof, metadata }
    })
    .execute()
}

/**
 * Composite query: a page of documents plus up to 10 sub-queries, each optionally bound
 * to values the page or an earlier sub-query proved
 */
export async function queryComposite (
  grpcPool: GRPCPool,
  dataContractId: IdentifierLike,
  query: DocumentsQuery & { offset?: number },
  subQueries: CompositeSubQuery[]
): Promise<CompositeDocuments> {
  const dataContract = await getDataContractByIdentifier(grpcPool, dataContractId)
  const identifier = new IdentifierWASM(dataContractId)

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest(client => client.getDocuments(createDocumentsV1Request({
      dataContractId: identifier.bytes(),
      documentType: query.documentTypeName,
      whereClauses: toWhereClauses(query.where),
      orderBy: toOrderClauses(query.orderBy),
      limit: query.limit,
      offset: query.offset,
      start: toStart(query.startAt, query.startAtIncluded),
      subQueries: toSubQueries(subQueries, identifier)
    })))
    .addProof(response => {
      const { proof, metadata } = getDocumentsV1Proof(response)

      const { rootHash, ...result } = verifyGroveDBProof(verifyCompositeDocumentsProof, proof.grovedbProof, dataContract, query, subQueries, LATEST_PLATFORM_VERSION)

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
