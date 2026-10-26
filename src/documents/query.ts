import { DocumentWASM, IdentifierLike, IdentifierWASM, verifyDocumentsProof, WhereClause } from 'pshenmic-dpp'
import { DAPI_DEFAULT_LIMIT, LATEST_PLATFORM_VERSION } from '../constants.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'
import QueryExecutor from '../QueryExecutor.js'
import { createDocumentsV1Request, getDocumentsV1Data, getDocumentsV1Proof, toDocuments, toOrderClauses, toStart, toWhereClauses } from './v1.js'

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

  const request = createDocumentsV1Request({
    dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
    documentType: documentTypeName,
    whereClauses: toWhereClauses(where),
    orderBy: toOrderClauses(orderBy),
    limit: limit ?? DAPI_DEFAULT_LIMIT,
    start: toStart(startIdentifier, startAtIncluded)
  })

  return await QueryExecutor.build(grpcPool)
    .setGrpcRequest('getDocuments', request)
    .mapProof(getDocumentsV1Proof)
    .setProofVerifier(verifyDocumentsProof, ({ metadata }) => {
      const metadataTimeMs = BigInt(metadata.timeMs)

      return [dataContract, documentTypeName, where, orderBy, limit, startIdentifier?.bytes(), startAtIncluded, metadataTimeMs, LATEST_PLATFORM_VERSION, metadataTimeMs]
    })
    .mapResponse(data => data.proved
      ? data.verified.documents ?? []
      : toDocuments(getDocumentsV1Data(data.result, 'documents').documents, dataContract, documentTypeName))
    .execute()
}
