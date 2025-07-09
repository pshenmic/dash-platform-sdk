import {
  BatchedTransitionWASM,
  BatchTransitionWASM,
  BatchType,
  DocumentCreateTransitionWASM,
  DocumentDeleteTransitionWASM, DocumentPurchaseTransitionWASM,
  DocumentReplaceTransitionWASM, DocumentTransferTransitionWASM,
  DocumentUpdatePriceTransitionWASM,
  DocumentWASM, StateTransitionWASM
} from 'pshenmic-dpp'
import {CreateStateTransitionDocumentBatchParams} from "../types";

const documentBatchTypesMap = {
  [BatchType.Create]: DocumentCreateTransitionWASM,
  [BatchType.Replace]: DocumentReplaceTransitionWASM,
  [BatchType.Delete]: DocumentDeleteTransitionWASM,
  [BatchType.UpdatePrice]: DocumentUpdatePriceTransitionWASM,
  [BatchType.Transfer]: DocumentTransferTransitionWASM,
  [BatchType.Purchase]: DocumentPurchaseTransitionWASM
}

export default async function createStateTransition (document: DocumentWASM, type: BatchType, identityContractNonce: bigint, params?: CreateStateTransitionDocumentBatchParams | undefined): Promise<StateTransitionWASM> {
  const TransitionClass = documentBatchTypesMap[type]

  if (TransitionClass == null) {
    throw new Error(`Unknown batch type: ${type}`)
  }

  if ([BatchType.Transfer, BatchType.UpdatePrice, BatchType.Purchase].includes(type) && params == null) {
    throw new Error('Params required for Transfer, UpdatePrice or Purchase document transitions')
  }

  // @ts-expect-error
  const documentTransition = new TransitionClass(document, identityContractNonce, params?.recipient ?? params?.price).toDocumentTransition()

  const batchedTransition = new BatchedTransitionWASM(documentTransition)

  const batch = BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.ownerId, 1)

  return batch.toStateTransition()
}
