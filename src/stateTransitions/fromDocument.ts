import { BatchType, DocumentsBatchWASM, DocumentWASM } from 'pshenmic-dpp'

export default async function fromDocument (document: DocumentWASM, batchType: BatchType, identityContractNonce: bigint): Promise<DocumentsBatchWASM> {
  const documentsBatch = new this.wasm.DocumentBatchWASM(batchType, document, identityContractNonce)

  return documentsBatch.toStateTransition()
}
