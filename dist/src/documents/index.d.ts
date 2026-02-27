import { DocumentTransitionParams, IdentifierLike } from '../../types.js';
import { DocumentWASM, IdentifierWASM, StateTransitionWASM, WhereClause } from 'pshenmic-dpp';
import GRPCConnectionPool from '../grpcConnectionPool.js';
/**
 * Collection of methods to work with documents like creation, querying or preparing a transition action
 *
 * @hideconstructor
 */
export declare class DocumentsController {
    /** @ignore **/
    grpcPool: GRPCConnectionPool;
    constructor(grpcPool: GRPCConnectionPool);
    /**
     * Creates a {DocumentWASM} instance that can be used to submit a document in the network.
     *
     * @param dataContractId {IdentifierLike} Identifier of the Data Contract
     * @param documentType {string}  Document type as string
     * @param data {object} Data as JSON object
     * @param owner {IdentifierLike} Identifier of the document's owner
     * @param revision {bigint=} revision (optional)
     *
     * @return {DataContractWASM}
     */
    create(dataContractId: IdentifierLike, documentType: string, data: object, owner: IdentifierLike, revision?: bigint): DocumentWASM;
    /**
     * Make a query for documents retrieval from the network.
     *
     * @param dataContractId {IdentifierLike} Identifier of the Data Contract where fetch documents from
     * @param documentType {string} Document type of the data contract
     * @param where {object=} Where query clauses according syntax https://docs.dash.org/projects/platform/en/stable/docs/reference/query-syntax.html
     * @param orderBy {object=} Order by clauses according syntax https://docs.dash.org/projects/platform/en/stable/docs/reference/query-syntax.html
     * @param limit {number=} Limit amount of documents per request
     * @param startAt {IdentifierLike=} Optional offset, where startAt is an identifier of the document. Use identifier of last item in previous response
     * @param startAfter {IdentifierLike=} Same as previous, but with exclusion. Cannot be set if startAt already provided
     */
    query(dataContractId: IdentifierLike, documentType: string, where?: WhereClause[], orderBy?: string[][], limit?: number, startAt?: IdentifierWASM, startAfter?: IdentifierWASM): Promise<DocumentWASM[]>;
    /**
     * Helper function for creating {StateTransitionWASM} from documents. It may be used to create any of 6 Document Transition actions:
     *
     * 1) Create - creates a document
     * 2) Replace - replaces a document
     * 3) Delete - deletes a document
     * 4) Transfer - transfer a document from one identity to another
     * 5) SetPrice - set a price for a document in credits
     * 6) Purchase - purchase a document from identity (if price was set)
     *
     * @param document {DocumentWASM} Instance of the document to make transition with
     * @param type {string} Type of the document transition, must be a one of ('create' | 'replace' | 'delete' | 'updatePrice' |'transfer' | 'purchase')
     * @param params {DocumentTransitionParams} params
     */
    createStateTransition(document: DocumentWASM, type: 'create' | 'replace' | 'delete' | 'updatePrice' | 'transfer' | 'purchase', params: DocumentTransitionParams): StateTransitionWASM;
}
