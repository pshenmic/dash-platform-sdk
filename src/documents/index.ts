import get from "./get";
import {IdentifierLike} from "../types";
import createDocument from "./create";
import {BatchType, DocumentWASM, IdentifierWASM} from "pshenmic-dpp";
import createStateTransition, {CreateStateTransitionParams} from "./createStateTransition";

export class DocumentsController {

    create(dataContractId: IdentifierLike, documentType: string, data: object, owner: IdentifierLike, revision?: bigint) {
        return createDocument(dataContractId, documentType, data, owner, revision);
    }

    query(dataContractId: IdentifierLike, documentType: string, where?: ArrayLike<any>, orderBy?: ArrayLike<any>, limit: number | undefined = 100, startAt?: IdentifierWASM, startAfter?: IdentifierWASM) {
        return get(dataContractId, documentType, where, orderBy, limit, startAt, startAfter);
    }

    createStateTransition(document: DocumentWASM, batchType: BatchType, identityContractNonce: bigint, params?: CreateStateTransitionParams) {
        return createStateTransition(document, batchType, identityContractNonce, params)
    }

}
