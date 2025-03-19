export default async function createDocument(dataContract, documentType, data, identityContractNonce, identity, identityPublicKey, privateKey) {
  return new this.wasm.DocumentWASM(
    data,
    documentType,
    identityContractNonce,
    dataContract,
    identity
  )
}
