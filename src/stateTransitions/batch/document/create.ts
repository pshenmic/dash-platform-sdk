import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'

export default async function (document: DocumentWASM, identityContractNonce: bigint): Promise<StateTransitionWASM> {
  const createTransition = new DocumentCreateTransitionWASM(document, identityContractNonce)

  const documentTransition = createTransition.toDocumentTransition()

  const batchedTransition = new BatchedTransitionWASM(documentTransition)

  const batch = BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.getOwnerId(), 1)

  return batch.toStateTransition()
}
