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

export interface CreateStateTransitionParams {
    recipient: string | null,
    price: bigint | null
}

const batchTypesMap = {
    [BatchType.Create] : DocumentCreateTransitionWASM,
    [BatchType.Replace] : DocumentReplaceTransitionWASM,
    [BatchType.Delete] : DocumentDeleteTransitionWASM,
    [BatchType.UpdatePrice] : DocumentUpdatePriceTransitionWASM,
    [BatchType.Transfer] : DocumentTransferTransitionWASM,
    [BatchType.Purchase] : DocumentPurchaseTransitionWASM,
}

export default async function createStateTransition (document: DocumentWASM, type: BatchType, identityContractNonce: bigint, params?: CreateStateTransitionParams): Promise<StateTransitionWASM> {
    if (type !== BatchType.Create) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        document.setRevision(document.getRevision()! + BigInt(1))
    }

    const transitionClass = batchTypesMap[type]

    if (!transitionClass) {
        throw new Error(`Unknown batch type: ${type}`)
    }

    if ([BatchType.Transfer, BatchType.UpdatePrice, BatchType.Purchase].indexOf(type) !== -1 && params == null ) {
        throw new Error('Params required for Transfer, UpdatePrice or Purchase document transitions')
    }

    // @ts-ignore
    const documentTransition = new transitionClass(document, identityContractNonce, params.recipient ?? params.price).toDocumentTransition()

    const batchedTransition = new BatchedTransitionWASM(documentTransition)

    const batch = BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], document.getOwnerId(), 1)

    return batch.toStateTransition()
}
