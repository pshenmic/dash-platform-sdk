import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'

export default async function (document: DocumentWASM, identityContractNonce: bigint): Promise<StateTransitionWASM> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.setRevision(document.getRevision()! + BigInt(1))

  const replaceTransition = new this.dpp.DocumentReplaceTransitionWASM(document, identityContractNonce)

  const documentTransition = replaceTransition.toDocumentTransition()

  const batchedTransition = new this.dpp.BatchedTransitionWASM(documentTransition)

  const batch = this.dpp.BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.getOwnerId(), 1)

  return batch.toStateTransition()
}
