import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../../../types'

export default async function (document: DocumentWASM, ownerId: IdentifierLike, identityContractNonce: bigint, price: bigint): Promise<StateTransitionWASM> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.setRevision(document.getRevision()! + BigInt(1))

  const deleteTransition = new this.dpp.DocumentPurchaseTransitionWASM(document, identityContractNonce, price)

  const documentTransition = deleteTransition.toDocumentTransition()

  const batchedTransition = new this.dpp.BatchedTransitionWASM(documentTransition)

  const batch = this.dpp.BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], ownerId, 1)

  return batch.toStateTransition()
}
