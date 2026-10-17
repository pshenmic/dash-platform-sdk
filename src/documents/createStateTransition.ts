import {
  BatchedTransitionWASM,
  BatchTransitionWASM,
  DocumentCreateTransitionWASM,
  DocumentDeleteTransitionWASM,
  DocumentPurchaseTransitionWASM,
  DocumentReplaceTransitionWASM,
  DocumentTransferTransitionWASM,
  DocumentUpdatePriceTransitionWASM,
  DocumentWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { DocumentTransitionParams, DocumentTransitionType } from '../../types.js'

const documentTransitionsMap = {
  create: {
    class: DocumentCreateTransitionWASM,
    arguments: ['identityContractNonce'],
    optionalArguments: ['prefundedVotingBalance', 'tokenPaymentInfo', 'actionFeeAgreement']
  },
  replace: {
    class: DocumentReplaceTransitionWASM,
    arguments: ['identityContractNonce'],
    optionalArguments: ['tokenPaymentInfo', 'actionFeeAgreement']
  },
  delete: {
    class: DocumentDeleteTransitionWASM,
    arguments: ['identityContractNonce'],
    optionalArguments: ['tokenPaymentInfo', 'actionFeeAgreement']
  },
  updatePrice: {
    class: DocumentUpdatePriceTransitionWASM,
    arguments: ['identityContractNonce', 'price'],
    optionalArguments: ['tokenPaymentInfo', 'actionFeeAgreement']
  },
  transfer: {
    class: DocumentTransferTransitionWASM,
    arguments: ['identityContractNonce', 'recipientId'],
    optionalArguments: ['tokenPaymentInfo', 'actionFeeAgreement']
  },
  purchase: {
    class: DocumentPurchaseTransitionWASM,
    arguments: ['identityContractNonce', 'amount'],
    optionalArguments: ['tokenPaymentInfo', 'actionFeeAgreement']
  }
}

export default function createStateTransition (document: DocumentWASM, type: DocumentTransitionType, params: DocumentTransitionParams): StateTransitionWASM {
  const { class: TransitionClass, arguments: classArguments, optionalArguments } = documentTransitionsMap[type]

  if (TransitionClass == null) {
    throw new Error(`Unimplemented transition type: ${type}`)
  }

  // check if all required params for document transition exists
  const [missingArgument] = classArguments
    .filter((classArgument: string) => params[classArgument] == null &&
          !(optionalArguments).includes(classArgument))

  if (missingArgument != null) {
    throw new Error(`Document transition param "${missingArgument}" is missing`)
  }

  const transitionParams = classArguments.concat(optionalArguments).map((classArgument: string) => params[classArgument])

  // @ts-expect-error
  const documentTransition = new TransitionClass(document, ...transitionParams).toDocumentTransition()

  const batchedTransition = new BatchedTransitionWASM(documentTransition)

  const batch = BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.ownerId, 1)

  return batch.toStateTransition()
}
