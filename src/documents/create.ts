import { DataContractWASM, DocumentWASM, IdentifierWASM } from 'pshenmic-dpp'

/**
 * Creates a document
 * @param dataContract {DataContractWASM}
 * @param documentType {string}
 * @param data {object}
 * @param identityContractNonce {bigint}
 * @param owner {IdentifierWASM}
 */
export default async function createDocument (
  dataContract: DataContractWASM,
  documentType: string,
  data: object,
  identityContractNonce: bigint,
  owner: IdentifierWASM): Promise<DocumentWASM> {
  return new this.wasm.DocumentWASM(
    data,
    documentType,
    identityContractNonce,
    dataContract,
    owner
  )
}
