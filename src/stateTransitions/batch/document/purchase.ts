import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'
import {IdentifierLike} from "../../../types";

export default async function (document: DocumentWASM, ownerId: IdentifierLike, identityContractNonce: bigint, price: bigint): Promise<StateTransitionWASM> {
  const deleteTransition = new this.dpp.DocumentPurchaseTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), price)

  const documentTransition = deleteTransition.toDocumentTransition()

  const batchedTransition = new this.dpp.BatchedTransitionWASM(documentTransition)

  const batch = this.dpp.BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], ownerId, 1)

  return batch.toStateTransition()
}
