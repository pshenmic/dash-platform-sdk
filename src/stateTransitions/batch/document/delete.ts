import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'

export default async function (document: DocumentWASM, identityContractNonce: bigint): Promise<StateTransitionWASM> {
  const deleteTransition = new this.dpp.DocumentDeleteTransitionWASM(document, identityContractNonce, document.getDocumentTypeName())

  const documentTransition = deleteTransition.toDocumentTransition()

  const batchedTransition = new this.dpp.BatchedTransitionWASM(documentTransition)

  const batch = this.dpp.BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.getOwnerId(), 1)

  return batch.toStateTransition()
}
