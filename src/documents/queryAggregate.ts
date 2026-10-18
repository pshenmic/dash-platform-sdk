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
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'
import { getDocumentsV1Proof, toOrderClauses, toSelect, toWhereClauses, verifyDocumentsV1Signature } from './v1.js'

export type DocumentsAggregateFunction = 'count' | 'sum' | 'avg'

export default async function queryAggregate (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  dataContractId: IdentifierLike,
  aggregateFunction: DocumentsAggregateFunction,
  query: AggregateProofQuery,
  field?: string
): Promise<ProvenAggregate> {
  if (aggregateFunction !== 'count' && field == null) {
    throw new Error(`Field is required for ${aggregateFunction} query`)
  }

  const dataContract = await getDataContractByIdentifier(grpcPool, quorumKeyProvider, dataContractId)

  const { proof, metadata } = await getDocumentsV1Proof(grpcPool, {
    dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
    documentType: query.documentTypeName,
    whereClauses: toWhereClauses(query.where),
    orderBy: toOrderClauses(query.orderBy),
    limit: query.limit,
    selects: toSelect({ function: aggregateFunction, field }),
    groupBy: query.groupBy ?? []
  })

  const metadataTimeMs = BigInt(metadata.timeMs)

  let verified

  if (aggregateFunction === 'count') {
    verified = verifyDocumentsCountProof(proof.grovedbProof, dataContract, query, LATEST_PLATFORM_VERSION, metadataTimeMs)
  } else if (aggregateFunction === 'sum') {
    verified = verifyDocumentsSumProof(proof.grovedbProof, dataContract, query, field as string, LATEST_PLATFORM_VERSION, metadataTimeMs)
  } else {
    verified = verifyDocumentsAverageProof(proof.grovedbProof, dataContract, query, field as string, LATEST_PLATFORM_VERSION, metadataTimeMs)
  }

  await verifyDocumentsV1Signature(quorumKeyProvider, proof, metadata, verified.rootHash)

  return verified.value
}
