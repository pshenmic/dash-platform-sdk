import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'

export default async function (document: DocumentWASM, identityContractNonce: bigint, price: bigint): Promise<StateTransitionWASM> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.setRevision(document.getRevision()! + BigInt(1))

  const updatePriceTransition = new DocumentUpdatePriceTransitionWASM(document, identityContractNonce, price)

  const documentTransition = updatePriceTransition.toDocumentTransition()

  const batchedTransition = new BatchedTransitionWASM(documentTransition)

  const batch = BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.getOwnerId(), 1)

  return batch.toStateTransition()
}
