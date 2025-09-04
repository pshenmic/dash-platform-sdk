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
import { DocumentTransitionParams } from '../types'

const documentTransitionsMap = {
  create: {
    class: DocumentCreateTransitionWASM,
    arguments: ['identityContractNonce'],
    optionalArguments: ['prefundedVotingBalance']
  },
  replace: {
    class: DocumentReplaceTransitionWASM,
    arguments: ['identityContractNonce'],
    optionalArguments: []
  },
  delete: {
    class: DocumentDeleteTransitionWASM,
    arguments: ['identityContractNonce'],
    optionalArguments: []
  },
  updatePrice: {
    class: DocumentUpdatePriceTransitionWASM,
    arguments: ['identityContractNonce', 'price'],
    optionalArguments: []
  },
  transfer: {
    class: DocumentTransferTransitionWASM,
    arguments: ['identityContractNonce', 'recipientId'],
    optionalArguments: []
  },
  purchase: {
    class: DocumentPurchaseTransitionWASM,
    arguments: ['identityContractNonce', 'amount'],
    optionalArguments: []
  }
}

export default function createStateTransition (document: DocumentWASM, type: 'create' | 'replace' | 'delete' | 'updatePrice' | 'transfer' | 'purchase', params: DocumentTransitionParams): StateTransitionWASM {
  const { class: TransitionClass, arguments: classArguments, optionalArguments } = documentTransitionsMap[type]

  if (TransitionClass == null) {
    throw new Error(`Unimplemented transition type: ${type}`)
  }

  // check if all required params for document transition exists
  const [missingArgument] = classArguments
    .filter((classArgument: string) => params[classArgument] == null &&
          !(optionalArguments as string[]).includes(classArgument))

  if (missingArgument != null) {
    throw new Error(`Document transition param "${missingArgument}" is missing`)
  }

  const transitionParams = classArguments.map((classArgument: string) => params[classArgument])

  // @ts-expect-error
  const documentTransition = new TransitionClass(document, ...transitionParams).toDocumentTransition()

  const batchedTransition = new BatchedTransitionWASM(documentTransition)

  const batch = BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.ownerId, 1)

  return batch.toStateTransition()
}
