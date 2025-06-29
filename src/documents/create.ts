import { DocumentWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'

/**
 * Creates a document
 * @param dataContractId {IdentifierLike}
 * @param documentType {string}
 * @param data {object}
 * @param owner {IdentifierLike}
 */
export default async function createDocument (
  dataContractId: IdentifierLike,
  documentType: string,
  data: object,
  owner: IdentifierLike,
  revision?: BigInt
): Promise<DocumentWASM> {
  return new DocumentWASM(
    data,
    documentType,
    BigInt(1),
    dataContractId,
    owner
  )
}
