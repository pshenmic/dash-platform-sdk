import { DocumentWASM, IdentifierLike } from 'pshenmic-dpp'

export default function createDocument (
  dataContractId: IdentifierLike,
  documentType: string,
  data: object,
  owner: IdentifierLike,
  revision?: bigint,
  documentId?: IdentifierLike
): DocumentWASM {
  return new DocumentWASM(
    data,
    documentType,
    revision ?? BigInt(1),
    dataContractId,
    owner,
    documentId,
    owner
  )
}
