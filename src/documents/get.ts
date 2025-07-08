import { GetDocumentsRequest, GetDocumentsResponse_GetDocumentsResponseV0 } from '../../proto/generated/platform'
import { encode } from 'cbor'
import { DocumentWASM, IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import getByIdentifier from '../dataContracts/getByIdentifier'
import { DAPI_DEFAULT_LIMIT } from '../constants'
import { IdentifierLike } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'
import { verifyDocumentProof } from 'wasm-drive-verify'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export default async function get (
  grpcPool: GRPCConnectionPool,
  dataContractId: IdentifierLike,
  documentTypeName: string,
  where?: ArrayLike<any>,
  orderBy?: ArrayLike<any>,
  limit: number | undefined = 100,
  startAt?: IdentifierWASM,
  startAfter?: IdentifierWASM
): Promise<DocumentWASM[]> {
  const getDocumentsRequest = GetDocumentsRequest.fromPartial({
    v0: {
      dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
      documentType: documentTypeName,
      where: (where != null) ? encode(where) : undefined,
      orderBy: (orderBy != null) ? encode(orderBy) : undefined,
      limit: limit ?? DAPI_DEFAULT_LIMIT,
      startAt: (startAt != null) ? startAt.bytes() : undefined,
      startAfter: (startAfter != null) ? startAfter.bytes() : undefined,
      prove: true
    }
  })

  const dataContract = await getByIdentifier(grpcPool, dataContractId)

  const { v0 } = await grpcPool.getClient().getDocuments(getDocumentsRequest)

  const { proof, metadata } = v0 as GetDocumentsResponse_GetDocumentsResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const startAtIncluded = (getDocumentsRequest.v0?.startAfter) == null

  const {
    root_hash: rootHash,
    documents
  } = verifyDocumentProof(proof.grovedbProof, dataContract.bytes(PlatformVersionWASM.PLATFORM_V9), documentTypeName, where, orderBy, limit, getDocumentsRequest.v0?.startAt, startAtIncluded, BigInt(metadata?.timeMs), PlatformVersionWASM.PLATFORM_V8)
  const quorumPublicKey = await getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return documents?.map(document => DocumentWASM.fromBytes(document, dataContract, documentTypeName, PlatformVersionWASM.PLATFORM_V1)) ?? []
}
