import { BatchedTransitionWASM, BatchTransitionWASM, DocumentCreateTransitionWASM, DocumentDeleteTransitionWASM, DocumentPurchaseTransitionWASM, DocumentReplaceTransitionWASM, DocumentTransferTransitionWASM, DocumentUpdatePriceTransitionWASM } from 'pshenmic-dpp';
const documentTransitionsMap = {
    create: {
        class: DocumentCreateTransitionWASM,
        arguments: ['identityContractNonce'],
        optionalArguments: ['prefundedVotingBalance', 'tokenPaymentInfo']
    },
    replace: {
        class: DocumentReplaceTransitionWASM,
        arguments: ['identityContractNonce'],
        optionalArguments: ['tokenPaymentInfo']
    },
    delete: {
        class: DocumentDeleteTransitionWASM,
        arguments: ['identityContractNonce'],
        optionalArguments: ['tokenPaymentInfo']
    },
    updatePrice: {
        class: DocumentUpdatePriceTransitionWASM,
        arguments: ['identityContractNonce', 'price'],
        optionalArguments: ['tokenPaymentInfo']
    },
    transfer: {
        class: DocumentTransferTransitionWASM,
        arguments: ['identityContractNonce', 'recipientId'],
        optionalArguments: ['tokenPaymentInfo']
    },
    purchase: {
        class: DocumentPurchaseTransitionWASM,
        arguments: ['identityContractNonce', 'amount'],
        optionalArguments: ['tokenPaymentInfo']
    }
};
export default function createStateTransition(document, type, params) {
    const { class: TransitionClass, arguments: classArguments, optionalArguments } = documentTransitionsMap[type];
    if (TransitionClass == null) {
        throw new Error(`Unimplemented transition type: ${type}`);
    }
    // check if all required params for document transition exists
    const [missingArgument] = classArguments
        .filter((classArgument) => params[classArgument] == null &&
        !(optionalArguments).includes(classArgument));
    if (missingArgument != null) {
        throw new Error(`Document transition param "${missingArgument}" is missing`);
    }
    const transitionParams = classArguments.concat(optionalArguments).map((classArgument) => params[classArgument]);
    // @ts-expect-error
    const documentTransition = new TransitionClass(document, ...transitionParams).toDocumentTransition();
    const batchedTransition = new BatchedTransitionWASM(documentTransition);
    const batch = BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.ownerId, 1);
    return batch.toStateTransition();
}
