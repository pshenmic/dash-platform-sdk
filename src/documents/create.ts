import { DocumentWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'

/**
 * Creates a document
 * @param dataContractId {IdentifierLike}
 * @param documentType {string}
 * @param data {object}
 * @param identityContractNonce {bigint}
 * @param owner {IdentifierLike}
 */
export default async function createDocument (
  dataContractId: IdentifierLike,
  documentType: string,
  data: object,
  identityContractNonce: bigint,
  owner: IdentifierLike
): Promise<DocumentWASM> {
  return new this.wasm.DocumentWASM(
    data,
    documentType,
    identityContractNonce,
    dataContractId,
    owner
  )
}
