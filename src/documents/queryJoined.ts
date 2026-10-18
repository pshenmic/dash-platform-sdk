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
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'
import { getDocumentsV1Proof, toOrderClauses, toStart, toSubQueries, toWhereClauses, verifyDocumentsV1Signature } from './v1.js'

export type ChainedDocuments = Omit<VerifiedChainedDocuments, 'rootHash'>
export type CompositeDocuments = Omit<VerifiedCompositeDocuments, 'rootHash'>

/**
 * Chained join: documents of `query`, then the documents of `outerDocumentTypeName`
 * their `joinProperty` refers to
 */
export async function queryChained (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  dataContractId: IdentifierLike,
  query: DocumentsQuery,
  joinProperty: string,
  outerDocumentTypeName: string
): Promise<ChainedDocuments> {
  const dataContract = await getDataContractByIdentifier(grpcPool, quorumKeyProvider, dataContractId)

  const { proof, metadata } = await getDocumentsV1Proof(grpcPool, {
    dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
    documentType: query.documentTypeName,
    whereClauses: toWhereClauses(query.where),
    orderBy: toOrderClauses(query.orderBy),
    limit: query.limit,
    start: toStart(query.startAt, query.startAtIncluded),
    chained: { joinProperty, outerDocumentType: outerDocumentTypeName }
  })

  const { rootHash, ...result } = verifyChainedDocumentsProof(proof.grovedbProof, dataContract, query, joinProperty, outerDocumentTypeName, LATEST_PLATFORM_VERSION)

  await verifyDocumentsV1Signature(quorumKeyProvider, proof, metadata, rootHash)

  return result
}

/**
 * Composite query: a page of documents plus up to 10 sub-queries, each optionally bound
 * to values the page or an earlier sub-query proved
 */
export async function queryComposite (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  dataContractId: IdentifierLike,
  query: DocumentsQuery & { offset?: number },
  subQueries: CompositeSubQuery[]
): Promise<CompositeDocuments> {
  const dataContract = await getDataContractByIdentifier(grpcPool, quorumKeyProvider, dataContractId)
  const identifier = new IdentifierWASM(dataContractId)

  const { proof, metadata } = await getDocumentsV1Proof(grpcPool, {
    dataContractId: identifier.bytes(),
    documentType: query.documentTypeName,
    whereClauses: toWhereClauses(query.where),
    orderBy: toOrderClauses(query.orderBy),
    limit: query.limit,
    offset: query.offset,
    start: toStart(query.startAt, query.startAtIncluded),
    subQueries: toSubQueries(subQueries, identifier)
  })

  const { rootHash, ...result } = verifyCompositeDocumentsProof(proof.grovedbProof, dataContract, query, subQueries, LATEST_PLATFORM_VERSION)

  await verifyDocumentsV1Signature(quorumKeyProvider, proof, metadata, rootHash)

  return result
}
