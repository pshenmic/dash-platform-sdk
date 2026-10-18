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
import withProofRetry from '../utils/withProofRetry.js'
import { getDocumentsV1Proof, toOrderClauses, toSelect, toWhereClauses, verifyDocumentsV1Signature } from './v1.js'

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

  return await withProofRetry(grpcPool, async client => {
    const { proof, metadata } = await getDocumentsV1Proof(client, {
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
      verified = verifyGroveDBProof(verifyDocumentsCountProof, proof.grovedbProof, dataContract, query, LATEST_PLATFORM_VERSION, metadataTimeMs)
    } else if (aggregateFunction === 'sum') {
      verified = verifyGroveDBProof(verifyDocumentsSumProof, proof.grovedbProof, dataContract, query, field as string, LATEST_PLATFORM_VERSION, metadataTimeMs)
    } else {
      verified = verifyGroveDBProof(verifyDocumentsAverageProof, proof.grovedbProof, dataContract, query, field as string, LATEST_PLATFORM_VERSION, metadataTimeMs)
    }

    await verifyDocumentsV1Signature(grpcPool, proof, metadata, verified.rootHash)

    return verified.value
  })
}
