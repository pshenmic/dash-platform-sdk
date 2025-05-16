import { IdentifierWASM, DocumentWASM } from 'pshenmic-dpp'

/**
 * Creates a document
 * @param dataContract
 * @param documentType
 * @param data
 * @param identityContractNonce
 * @param identity
 */
export default async function createDocument (
  dataContract: IdentifierWASM | string | ArrayLike<number>,
  documentType: string,
  data: Object,
  identityContractNonce: BigInt,
  identity: IdentifierWASM | string | ArrayLike<number>
): Promise<DocumentWASM> {
  return new this.wasm.DocumentWASM(
    data,
    documentType,
    identityContractNonce,
    dataContract,
    identity
  )
}
