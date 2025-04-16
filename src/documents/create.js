export default async function createDocument (dataContract, documentType, data, identityContractNonce, identity) {
  return new this.wasm.DocumentWASM(
    data,
    documentType,
    identityContractNonce,
    dataContract,
    identity
  )
}
