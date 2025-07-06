import { DocumentWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'

/**
 * Creates a document
 * @param dataContractId {IdentifierLike}
 * @param documentType {string}
 * @param data {object}
 * @param owner {IdentifierLike}
 * @param revision {bigint|undefined|null}
 * @param documentId {IdentifierLike|undefined|null}
 */
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
