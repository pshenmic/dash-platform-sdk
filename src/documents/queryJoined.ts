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
import QueryExecutor from '../QueryExecutor.js'
import {
  createDocumentsV1Request,
  getDocumentsV1Data,
  getDocumentsV1Proof,
  toDocumentRemovalEntry,
  toDocuments,
  toOrderClauses,
  toStart,
  toSubQueries,
  toWhereClauses
} from './v1.js'

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

  const request = createDocumentsV1Request({
    dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
    documentType: query.documentTypeName,
    whereClauses: toWhereClauses(query.where),
    orderBy: toOrderClauses(query.orderBy),
    limit: query.limit,
    start: toStart(query.startAt, query.startAtIncluded),
    chained: { joinProperty, outerDocumentType: outerDocumentTypeName }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .addGrpcRequest('getDocuments', request)
    .setProofExtractor(getDocumentsV1Proof)
    .addProofVerifier(verifyChainedDocumentsProof, dataContract, query, joinProperty, outerDocumentTypeName, LATEST_PLATFORM_VERSION)
    .addMapper(data => {
      if (data.proved) {
        const { rootHash, ...result } = data.verified

        return result
      }

      const { innerDocuments, outerDocuments, missingOuterIds, removedOuterDocuments } = getDocumentsV1Data(data.result, 'chained')

      return {
        innerDocuments: toDocuments(innerDocuments, dataContract, query.documentTypeName),
        outerDocuments: toDocuments(outerDocuments, dataContract, outerDocumentTypeName),
        missingOuterIds: missingOuterIds.map(id => new IdentifierWASM(id)),
        removedOuterDocuments: removedOuterDocuments.map(toDocumentRemovalEntry)
      }
    })
    .execute()
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

  const request = createDocumentsV1Request({
    dataContractId: identifier.bytes(),
    documentType: query.documentTypeName,
    whereClauses: toWhereClauses(query.where),
    orderBy: toOrderClauses(query.orderBy),
    limit: query.limit,
    offset: query.offset,
    start: toStart(query.startAt, query.startAtIncluded),
    subQueries: toSubQueries(subQueries, identifier)
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .addGrpcRequest('getDocuments', request)
    .setProofExtractor(getDocumentsV1Proof)
    .addProofVerifier(verifyCompositeDocumentsProof, dataContract, query, subQueries, LATEST_PLATFORM_VERSION)
    .addMapper(data => {
      if (data.proved) {
        const { rootHash, ...result } = data.verified

        return result
      }

      const { pageDocuments, subResults } = getDocumentsV1Data(data.result, 'composite')

      return {
        pageDocuments: toDocuments(pageDocuments, dataContract, query.documentTypeName),
        subResults: subResults.map(({ result, missingIds, removed }, index) => {
          const subQuery = subQueries[index]

          return {
            documents: result.oneofKind === 'documents'
              ? toDocuments(result.documents.documents, subQuery.dataContract ?? dataContract, subQuery.documentTypeName)
              : undefined,
            counts: result.oneofKind === 'counts'
              ? result.counts.entries.map(({ inKey, key, count }) => ({ inKey: inKey ?? null, key, count: BigInt(count) }))
              : undefined,
            missingIds: missingIds.map(id => new IdentifierWASM(id)),
            removals: removed.map(toDocumentRemovalEntry)
          }
        })
      }
    })
    .execute()
}
