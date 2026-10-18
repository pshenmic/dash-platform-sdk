import { DocumentWASM, IdentifierLike, IdentifierWASM, verifyDocumentsProof, WhereClause } from 'pshenmic-dpp'
import { DAPI_DEFAULT_LIMIT, LATEST_PLATFORM_VERSION } from '../constants.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import withProofRetry from '../utils/withProofRetry.js'
import { getDocumentsV1Proof, toOrderClauses, toStart, toWhereClauses, verifyDocumentsV1Signature } from './v1.js'

export default async function query (
  grpcPool: GRPCPool,
  dataContractId: IdentifierLike,
  documentTypeName: string,
  where?: WhereClause[],
  orderBy?: string[][],
  limit: number | undefined = 100,
  startAt?: IdentifierWASM,
  startAfter?: IdentifierWASM
): Promise<DocumentWASM[]> {
  const dataContract = await getDataContractByIdentifier(grpcPool, dataContractId)

  const startIdentifier = startAt ?? startAfter
  const startAtIncluded = startAt != null

  return await withProofRetry(grpcPool, async client => {
    const { proof, metadata } = await getDocumentsV1Proof(client, {
      dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
      documentType: documentTypeName,
      whereClauses: toWhereClauses(where),
      orderBy: toOrderClauses(orderBy),
      limit: limit ?? DAPI_DEFAULT_LIMIT,
      start: toStart(startIdentifier, startAtIncluded)
    })

    const metadataTimeMs = BigInt(metadata.timeMs)

    const {
      rootHash,
      documents
    } = verifyGroveDBProof(verifyDocumentsProof, proof.grovedbProof, dataContract, documentTypeName, where, orderBy, limit, startIdentifier?.bytes(), startAtIncluded, metadataTimeMs, LATEST_PLATFORM_VERSION, metadataTimeMs)

    await verifyDocumentsV1Signature(grpcPool, proof, metadata, rootHash)

    return documents ?? []
  })
}
