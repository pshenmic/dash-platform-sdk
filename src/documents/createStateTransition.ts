import {
  BatchedTransitionWASM,
  BatchTransitionWASM,
  DocumentCreateTransitionWASM,
  DocumentDeleteTransitionWASM, DocumentPurchaseTransitionWASM,
  DocumentReplaceTransitionWASM, DocumentTransferTransitionWASM,
  DocumentUpdatePriceTransitionWASM,
  DocumentWASM, StateTransitionWASM
} from 'pshenmic-dpp'
import { CreateStateTransitionDocumentBatchParams } from '../types'

const documentBatchTypesMap = {
  create: DocumentCreateTransitionWASM,
  replace: DocumentReplaceTransitionWASM,
  delete: DocumentDeleteTransitionWASM,
  updatePrice: DocumentUpdatePriceTransitionWASM,
  transfer: DocumentTransferTransitionWASM,
  purchase: DocumentPurchaseTransitionWASM
}

export default function createStateTransition (document: DocumentWASM, type: 'create' | 'replace' | 'delete' | 'updatePrice' | 'transfer' | 'purchase', identityContractNonce: bigint, params?: CreateStateTransitionDocumentBatchParams | undefined): StateTransitionWASM {
  const TransitionClass = documentBatchTypesMap[type]

  if (TransitionClass == null) {
    throw new Error(`Unknown batch type: ${type}. Should be 'create' or 'replace' or 'delete' or 'updatePrice' or 'transfer' or 'purchase'`)
  }

  // @ts-expect-error
  const documentTransition = new TransitionClass(document, identityContractNonce, params?.recipient ?? params?.price).toDocumentTransition()

  const batchedTransition = new BatchedTransitionWASM(documentTransition)

  const batch = BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.ownerId, 1)

  return batch.toStateTransition()
}
