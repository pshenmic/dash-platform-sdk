import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'

export default async function (document: DocumentWASM, identityContractNonce: bigint, price: bigint): Promise<StateTransitionWASM> {
  const updatePriceTransition = new this.dpp.DocumentUpdatePriceTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), price)

  const documentTransition = updatePriceTransition.toDocumentTransition()

  const batchedTransition = new this.dpp.BatchedTransitionWASM(documentTransition)

  const batch = this.dpp.BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.getOwnerId(), 1)

  return batch.toStateTransition()
}
