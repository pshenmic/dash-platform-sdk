import {
  AggregateProofQuery,
  IdentifierLike,
  IdentifierWASM,
  ProvenAggregate,
  ProvenAggregateEntry,
  verifyDocumentsAverageProof,
  verifyDocumentsCountProof,
  verifyDocumentsSumProof
} from 'pshenmic-dpp'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'
import QueryExecutor, { ResponseResult } from '../QueryExecutor.js'
import { createDocumentsV1Request, getDocumentsV1Data, getDocumentsV1Proof, toOrderClauses, toSelect, toWhereClauses } from './v1.js'
import { GetDocumentsResponse } from '../../proto/generated/platform.js'

export type DocumentsAggregateFunction = 'count' | 'sum' | 'avg'

/**
 * Aggregate of the documents, `mode` (the shape of the proof) is known only with proof
 */
export type DocumentsAggregate = Omit<ProvenAggregate, 'mode'> & { mode?: ProvenAggregate['mode'] }

/**
 * Converts the aggregate of a response requested without proof to the one of the proof verification.
 * Aggregate without grouping is returned as a single entry with an empty key, groups without documents
 * are skipped like in the proof. The `in` value of a carrier aggregate (`inKey`) is not returned without proof
 */
function toDocumentsAggregate (result: ResponseResult<GetDocumentsResponse>, aggregateFunction: DocumentsAggregateFunction): DocumentsAggregate {
  const toEntry = ({ inKey, key, count, sum }: { inKey?: Uint8Array, key?: Uint8Array, count?: string, sum?: string }): ProvenAggregateEntry => ({
    inKey: inKey ?? null,
    key: key ?? new Uint8Array(),
    count: count != null ? BigInt(count) : undefined,
    sum: sum != null ? BigInt(sum) : undefined
  })

  if (aggregateFunction === 'count') {
    const { variant } = getDocumentsV1Data(result, 'counts')

    if (variant.oneofKind === 'aggregateCount') {
      return { entries: [toEntry({ count: variant.aggregateCount })] }
    }

    return { entries: variant.oneofKind === 'entries' ? variant.entries.entries.filter(({ count }) => count !== '0').map(toEntry) : [] }
  }

  if (aggregateFunction === 'sum') {
    const { variant } = getDocumentsV1Data(result, 'sums')

    if (variant.oneofKind === 'aggregateSum') {
      return { entries: [toEntry({ sum: variant.aggregateSum })] }
    }

    return { entries: variant.oneofKind === 'entries' ? variant.entries.entries.map(toEntry) : [] }
  }

  const { variant } = getDocumentsV1Data(result, 'averages')

  if (variant.oneofKind === 'aggregateAverage') {
    return { entries: [toEntry(variant.aggregateAverage)] }
  }

  return { entries: variant.oneofKind === 'entries' ? variant.entries.entries.filter(({ count }) => count !== '0').map(toEntry) : [] }
}

export default async function queryAggregate (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  dataContractId: IdentifierLike,
  aggregateFunction: DocumentsAggregateFunction,
  query: AggregateProofQuery,
  field?: string
): Promise<DocumentsAggregate> {
  if (aggregateFunction !== 'count' && field == null) {
    throw new Error(`Field is required for ${aggregateFunction} query`)
  }

  const dataContract = await getDataContractByIdentifier(grpcPool, quorumKeyProvider, dataContractId)

  const request = createDocumentsV1Request({
    dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
    documentType: query.documentTypeName,
    whereClauses: toWhereClauses(query.where),
    orderBy: toOrderClauses(query.orderBy),
    limit: query.limit,
    selects: toSelect({ function: aggregateFunction, field }),
    groupBy: query.groupBy ?? []
  })

  const executor = QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getDocuments', request)
    .mapProof(getDocumentsV1Proof)

  if (aggregateFunction === 'count') {
    return await executor
      .setProofVerifier(verifyDocumentsCountProof, ({ metadata }) => [dataContract, query, LATEST_PLATFORM_VERSION, BigInt(metadata.timeMs)])
      .mapResponse(data => data.proved ? data.verified.value : toDocumentsAggregate(data.result, aggregateFunction))
      .execute()
  }

  const verify = aggregateFunction === 'sum' ? verifyDocumentsSumProof : verifyDocumentsAverageProof

  return await executor
    .setProofVerifier(verify, ({ metadata }) => [dataContract, query, field as string, LATEST_PLATFORM_VERSION, BigInt(metadata.timeMs)])
    .mapResponse(data => data.proved ? data.verified.value : toDocumentsAggregate(data.result, aggregateFunction))
    .execute()
}
