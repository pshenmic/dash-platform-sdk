import { IdentifierWASM, DocumentWASM } from 'pshenmic-dpp'

/**
 * Creates a document
 * @param dataContractId {DataContractWASM}
 * @param documentType {string}
 * @param data {object}
 * @param identityContractNonce {bigint}
 * @param owner {IdentifierLike}
 */
export default async function createDocument (
  dataContractId: IdentifierWASM | string | ArrayLike<number>,
  documentType: string,
  data: object,
  identityContractNonce: bigint,
  owner: IdentifierWASM | string | ArrayLike<number>
): Promise<DocumentWASM> {
  return new this.wasm.DocumentWASM(
    data,
    documentType,
    identityContractNonce,
    dataContractId,
    owner
  )
}
