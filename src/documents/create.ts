/**
 * Creates a document
 * @param dataContract
 * @param documentType
 * @param data
 * @param identityContractNonce
 * @param identity
 */
export default async function createDocument (dataContract, documentType, data, identityContractNonce, identity) {
  return new this.wasm.DocumentWASM(
    data,
    documentType,
    identityContractNonce,
    dataContract,
    identity
  )
}
