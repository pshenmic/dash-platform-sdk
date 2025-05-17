import { BatchType, DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'

export default async function fromDocument (
  document: DocumentWASM, batchType: BatchType, identityContractNonce: bigint
): Promise<StateTransitionWASM> {
  const documentsBatch = new this.wasm.DocumentBatchWASM(batchType, document, identityContractNonce)

  return documentsBatch.toStateTransition()
}
