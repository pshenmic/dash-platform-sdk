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
import { GetDocumentsRequest } from '../../proto/generated/platform.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor from '../QueryExecutor.js'
import { createDocumentsV1Request, getDocumentsV1Proof, toHavingClauses, toOrderClauses, toSelect, toWhereClauses } from './v1.js'

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
export async function queryRanked (grpcPool: GRPCPool, dataContractId: IdentifierLike, query: AggregateDocumentsQuery): Promise<ProvenRankedPage> {
  const dataContract = await getDataContractByIdentifier(grpcPool, dataContractId)

  const request = createRankedRequest(dataContractId, query, [])

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getDocuments', request)
    .addProof(response => {
      const { proof, metadata } = getDocumentsV1Proof(response)

      const { rootHash, value } = verifyGroveDBProof(verifyRankedDocumentsProof, proof.grovedbProof, dataContract, query, LATEST_PLATFORM_VERSION, BigInt(metadata.timeMs))

      return { result: value, rootHash, proof, metadata }
    })
    .execute()
}

/**
 * Having query: groups of `groupBy` whose aggregate falls within the `having` bounds
 */
export async function queryHaving (grpcPool: GRPCPool, dataContractId: IdentifierLike, query: AggregateDocumentsQuery & { having: HavingClause[] }): Promise<ProvenRankedEntry[]> {
  const dataContract = await getDataContractByIdentifier(grpcPool, dataContractId)

  const request = createRankedRequest(dataContractId, query, query.having)

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getDocuments', request)
    .addProof(response => {
      const { proof, metadata } = getDocumentsV1Proof(response)

      const { rootHash, value } = verifyGroveDBProof(verifyHavingDocumentsProof, proof.grovedbProof, dataContract, query, LATEST_PLATFORM_VERSION, BigInt(metadata.timeMs))

      return { result: value, rootHash, proof, metadata }
    })
    .execute()
}
