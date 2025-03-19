export default async function fromDocument(document, batchType, identityContractNonce, params = {}) {
  const documentsBatch = this.wasm.DocumentBatchWASM.new(batchType, document, identityContractNonce)

  return documentsBatch.toStateTransition()
}
