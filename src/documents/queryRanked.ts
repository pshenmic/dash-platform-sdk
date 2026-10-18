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
import { PlatformClient } from '../../proto/generated/platform.client.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import withProofRetry from '../utils/withProofRetry.js'
import { getDocumentsV1Proof, toHavingClauses, toOrderClauses, toSelect, toWhereClauses, verifyDocumentsV1Signature } from './v1.js'

async function getRankedProof (client: PlatformClient, dataContractId: IdentifierLike, query: AggregateDocumentsQuery, having: HavingClause[]): ReturnType<typeof getDocumentsV1Proof> {
  return await getDocumentsV1Proof(client, {
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

  return await withProofRetry(grpcPool, async client => {
    const { proof, metadata } = await getRankedProof(client, dataContractId, query, [])

    const { rootHash, value } = verifyGroveDBProof(verifyRankedDocumentsProof, proof.grovedbProof, dataContract, query, LATEST_PLATFORM_VERSION, BigInt(metadata.timeMs))

    await verifyDocumentsV1Signature(grpcPool, proof, metadata, rootHash)

    return value
  })
}

/**
 * Having query: groups of `groupBy` whose aggregate falls within the `having` bounds
 */
export async function queryHaving (grpcPool: GRPCPool, dataContractId: IdentifierLike, query: AggregateDocumentsQuery & { having: HavingClause[] }): Promise<ProvenRankedEntry[]> {
  const dataContract = await getDataContractByIdentifier(grpcPool, dataContractId)

  return await withProofRetry(grpcPool, async client => {
    const { proof, metadata } = await getRankedProof(client, dataContractId, query, query.having)

    const { rootHash, value } = verifyGroveDBProof(verifyHavingDocumentsProof, proof.grovedbProof, dataContract, query, LATEST_PLATFORM_VERSION, BigInt(metadata.timeMs))

    await verifyDocumentsV1Signature(grpcPool, proof, metadata, rootHash)

    return value
  })
}
