import {
  AggregateDocumentsQuery,
  HavingClause,
  IdentifierLike,
  IdentifierWASM,
  ProvenRankedEntry,
  ProvenRankedPage,
  verifyHavingDocumentsProof,
  verifyRankedDocumentsProof
} from 'pshenmic-dpp'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import { GetDocumentsRequest, GetDocumentsResponse_GetDocumentsResponseV1_RankedEntry } from '../../proto/generated/platform.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'
import QueryExecutor from '../QueryExecutor.js'
import { createDocumentsV1Request, getDocumentsV1Data, getDocumentsV1Proof, toHavingClauses, toOrderClauses, toSelect, toWhereClauses } from './v1.js'

// average of the proof verification is a fixed point number scaled by 10^19
const AVG_FIXED_POINT_SCALE = 1e19

/**
 * Converts the ranked entries of a response requested without proof to the ones of the proof verification
 */
function toRankedEntries (entries: GetDocumentsResponse_GetDocumentsResponseV1_RankedEntry[]): ProvenRankedEntry[] {
  return entries.map(({ key, inKey, value }) => {
    let rankedValue: ProvenRankedEntry['value'] = {}

    if (value.oneofKind === 'count') {
      rankedValue = { count: BigInt(value.count) }
    } else if (value.oneofKind === 'sum') {
      rankedValue = { sum: BigInt(value.sum) }
    } else if (value.oneofKind === 'avg') {
      // average is returned as a double without proof, so its precision is limited
      rankedValue = { avgFixedPoint: BigInt(Math.round(value.avg * AVG_FIXED_POINT_SCALE)) }
    }

    return { key, inKey: inKey ?? null, value: rankedValue }
  })
}

function createRankedRequest (dataContractId: IdentifierLike, query: AggregateDocumentsQuery, having: HavingClause[]): GetDocumentsRequest {
  return createDocumentsV1Request({
    dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
    documentType: query.documentTypeName,
    whereClauses: toWhereClauses(query.where),
    orderBy: toOrderClauses(query.orderBy),
    limit: query.limit,
    offset: query.offset,
    selects: toSelect(query.select),
    groupBy: query.groupBy,
    having: toHavingClauses(having)
  })
}

/**
 * Top-K query: groups of `groupBy` ranked by the selected aggregate in the order `orderBy` names
 */
export async function queryRanked (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, dataContractId: IdentifierLike, query: AggregateDocumentsQuery): Promise<ProvenRankedPage> {
  const dataContract = await getDataContractByIdentifier(grpcPool, quorumKeyProvider, dataContractId)

  const request = createRankedRequest(dataContractId, query, [])

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .addGrpcRequest('getDocuments', request)
    .setProofExtractor(getDocumentsV1Proof)
    .addProofVerifier(verifyRankedDocumentsProof, ({ metadata }) => [dataContract, query, LATEST_PLATFORM_VERSION, BigInt(metadata.timeMs)])
    .addMapper(data => {
      if (data.proved) {
        return data.verified.value
      }

      const { entries, skipped } = getDocumentsV1Data(data.result, 'ranked')

      return { skipped: BigInt(skipped ?? 0), entries: toRankedEntries(entries) }
    })
    .execute()
}

/**
 * Having query: groups of `groupBy` whose aggregate falls within the `having` bounds
 */
export async function queryHaving (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, dataContractId: IdentifierLike, query: AggregateDocumentsQuery & { having: HavingClause[] }): Promise<ProvenRankedEntry[]> {
  const dataContract = await getDataContractByIdentifier(grpcPool, quorumKeyProvider, dataContractId)

  const request = createRankedRequest(dataContractId, query, query.having)

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .addGrpcRequest('getDocuments', request)
    .setProofExtractor(getDocumentsV1Proof)
    .addProofVerifier(verifyHavingDocumentsProof, ({ metadata }) => [dataContract, query, LATEST_PLATFORM_VERSION, BigInt(metadata.timeMs)])
    .addMapper(data => data.proved ? data.verified.value : toRankedEntries(getDocumentsV1Data(data.result, 'ranked').entries))
    .execute()
}
