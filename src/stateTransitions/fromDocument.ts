export default async function fromDocument (document, batchType, identityContractNonce) {
  const documentsBatch = new this.wasm.DocumentBatchWASM(batchType, document, identityContractNonce)

  return documentsBatch.toStateTransition()
}
