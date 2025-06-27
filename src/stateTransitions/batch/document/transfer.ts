import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../../../types'

export default async function (document: DocumentWASM, identityContractNonce: bigint, recipient: IdentifierLike): Promise<StateTransitionWASM> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.setRevision(document.getRevision()! + BigInt(1))

  const deleteTransition = new this.dpp.DocumentTransferTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), recipient)

  const documentTransition = deleteTransition.toDocumentTransition()

  const batchedTransition = new this.dpp.BatchedTransitionWASM(documentTransition)

  const batch = this.dpp.BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.getOwnerId(), 1)

  return batch.toStateTransition()
}
