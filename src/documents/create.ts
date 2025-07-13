import { DocumentWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'

export default async function createDocument (
  dataContractId: IdentifierLike,
  documentType: string,
  data: object,
  owner: IdentifierLike,
  revision?: bigint,
  documentId?: IdentifierLike
): Promise<DocumentWASM> {
  return new DocumentWASM(
    data,
    documentType,
    revision ?? BigInt(1),
    dataContractId,
    owner,
    documentId
  )
}
