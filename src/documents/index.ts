import { DocumentTransitionParams, DocumentTransitionType } from '../../types.js'
import createDocument from './create.js'
import {
  AggregateDocumentsQuery,
  AggregateProofQuery,
  AgreedFeeMultiplierWASM,
  CompositeSubQuery,
  DocumentActionFeeAgreementWASM,
  DocumentsQuery,
  DocumentWASM, HavingClause, IdentifierLike,
  IdentifierWASM,
  PrefundedVotingBalanceWASM,
  ProvenAggregate,
  ProvenRankedEntry,
  ProvenRankedPage,
  StateTransitionWASM,
  TokenPaymentInfoWASM, WhereClause
} from 'pshenmic-dpp'
import createStateTransition from './createStateTransition.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import query from './query.js'
import getActionFeeAgreement from './getActionFeeAgreement.js'
import queryAggregate from './queryAggregate.js'
import { queryHaving, queryRanked } from './queryRanked.js'
import { ChainedDocuments, CompositeDocuments, queryChained, queryComposite } from './queryJoined.js'

/**
 * Collection of methods to work with documents like creation, querying or preparing a transition action
 *
 * @hideconstructor
 */
export class DocumentsController {
  /** @ignore **/
  grpcPool: GRPCPool
  /** @ignore **/
  quorumKeyProvider: QuorumKeyProvider

  constructor (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider) {
    this.grpcPool = grpcPool
    this.quorumKeyProvider = quorumKeyProvider
  }

  /**
   * Creates a {DocumentWASM} instance that can be used to submit a document in the network.
   *
   * @param dataContractId {IdentifierLike} Identifier of the Data Contract
   * @param documentType {string}  Document type as string
   * @param data {object} Data as JSON object
   * @param owner {IdentifierLike} Identifier of the document's owner
   * @param identityContractNonce {bigint} Identity contract nonce of the transition that will create the document, used for document id generation
   * @param revision {bigint=} revision (optional)
   *
   * @return {DataContractWASM}
   */
  create (dataContractId: IdentifierLike, documentType: string, data: object, owner: IdentifierLike, identityContractNonce: bigint, revision?: bigint): DocumentWASM {
    return createDocument(new IdentifierWASM(dataContractId), documentType, data, new IdentifierWASM(owner), identityContractNonce, revision)
  }

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
  async query (dataContractId: IdentifierLike, documentType: string, where?: WhereClause[], orderBy?: string[][], limit?: number, startAt?: IdentifierWASM, startAfter?: IdentifierWASM): Promise<DocumentWASM[]> {
    if (startAfter != null && startAt != null) {
      throw new Error('You may only set either startAfter or startAt at once')
    }

    return await query(this.grpcPool, this.quorumKeyProvider, new IdentifierWASM(dataContractId), documentType, where, orderBy, limit ?? 100, startAt, startAfter)
  }

  /**
   * Counts documents matching a query. Without `groupBy` returns one entry with the total,
   * with `groupBy` one entry per group
   *
   * @param dataContractId {IdentifierLike} Identifier of the Data Contract
   * @param query {AggregateProofQuery} documentTypeName, where, orderBy, groupBy and limit of the query
   *
   * @return {Promise<ProvenAggregate>}
   */
  async count (dataContractId: IdentifierLike, query: AggregateProofQuery): Promise<ProvenAggregate> {
    return await queryAggregate(this.grpcPool, this.quorumKeyProvider, dataContractId, 'count', query)
  }

  /**
   * Sums a field over documents matching a query. Without `groupBy` returns one entry with the total,
   * with `groupBy` one entry per group
   *
   * @param dataContractId {IdentifierLike} Identifier of the Data Contract
   * @param query {AggregateProofQuery} documentTypeName, where, orderBy, groupBy and limit of the query
   * @param field {string} Integer field to sum
   *
   * @return {Promise<ProvenAggregate>}
   */
  async sum (dataContractId: IdentifierLike, query: AggregateProofQuery, field: string): Promise<ProvenAggregate> {
    return await queryAggregate(this.grpcPool, this.quorumKeyProvider, dataContractId, 'sum', query, field)
  }

  /**
   * Averages a field over documents matching a query. Entries carry `count` and `sum`, the average is `sum / count`.
   * Without `groupBy` returns one entry with the total, with `groupBy` one entry per group
   *
   * @param dataContractId {IdentifierLike} Identifier of the Data Contract
   * @param query {AggregateProofQuery} documentTypeName, where, orderBy, groupBy and limit of the query
   * @param field {string} Integer field to average
   *
   * @return {Promise<ProvenAggregate>}
   */
  async average (dataContractId: IdentifierLike, query: AggregateProofQuery, field: string): Promise<ProvenAggregate> {
    return await queryAggregate(this.grpcPool, this.quorumKeyProvider, dataContractId, 'avg', query, field)
  }

  /**
   * Top-K query: groups of `groupBy` ranked by the selected aggregate. Order by the selected field,
   * or by `$count` for count, e.g. `orderBy: [['$count', 'desc']]`. Supports `limit` and `offset`
   *
   * @param dataContractId {IdentifierLike} Identifier of the Data Contract
   * @param query {AggregateDocumentsQuery} documentTypeName, select, groupBy, where, orderBy, limit and offset of the query
   *
   * @return {Promise<ProvenRankedPage>}
   */
  async ranked (dataContractId: IdentifierLike, query: AggregateDocumentsQuery): Promise<ProvenRankedPage> {
    return await queryRanked(this.grpcPool, this.quorumKeyProvider, dataContractId, query)
  }

  /**
   * Having query: groups of `groupBy` whose aggregate falls within the `having` bounds
   *
   * @param dataContractId {IdentifierLike} Identifier of the Data Contract
   * @param query {AggregateDocumentsQuery & { having: HavingClause[] }} ranked query with having clauses
   *
   * @return {Promise<ProvenRankedEntry[]>}
   */
  async having (dataContractId: IdentifierLike, query: AggregateDocumentsQuery & { having: HavingClause[] }): Promise<ProvenRankedEntry[]> {
    return await queryHaving(this.grpcPool, this.quorumKeyProvider, dataContractId, query)
  }

  /**
   * Chained join: documents of the query, then the documents of `outerDocumentType`
   * their `joinProperty` refers to
   *
   * @param dataContractId {IdentifierLike} Identifier of the Data Contract
   * @param query {DocumentsQuery} documentTypeName, where, orderBy, limit, startAt and startAtIncluded of the inner query
   * @param joinProperty {string} Property of the inner documents referring to the outer documents
   * @param outerDocumentType {string} Document type of the outer documents
   *
   * @return {Promise<ChainedDocuments>}
   */
  async chained (dataContractId: IdentifierLike, query: DocumentsQuery, joinProperty: string, outerDocumentType: string): Promise<ChainedDocuments> {
    return await queryChained(this.grpcPool, this.quorumKeyProvider, dataContractId, query, joinProperty, outerDocumentType)
  }

  /**
   * Composite query: a page of documents plus up to 10 sub-queries, each optionally bound
   * to values the page or an earlier sub-query proved
   *
   * @param dataContractId {IdentifierLike} Identifier of the Data Contract
   * @param query {DocumentsQuery & { offset?: number }} page query
   * @param subQueries {CompositeSubQuery[]} sub-queries, `binding.source` is `'page'` or an index of an earlier sub-query
   *
   * @return {Promise<CompositeDocuments>}
   */
  async composite (dataContractId: IdentifierLike, query: DocumentsQuery & { offset?: number }, subQueries: CompositeSubQuery[]): Promise<CompositeDocuments> {
    return await queryComposite(this.grpcPool, this.quorumKeyProvider, dataContractId, query, subQueries)
  }

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
  createStateTransition (document: DocumentWASM, type: DocumentTransitionType, params: DocumentTransitionParams): StateTransitionWASM {
    if (type === 'transfer' && params.recipientId == null) {
      throw new Error('Recipient is required for transfer transition')
    }

    if (type === 'updatePrice' && params.price == null) {
      throw new Error('Price is required for updatePrice transition')
    }

    if (type === 'purchase' && params.amount == null) {
      throw new Error('Amount is required for updatePrice transition')
    }

    if (params.prefundedVotingBalance != null) {
      const { indexName, amount } = params.prefundedVotingBalance

      // @ts-expect-error
      params.prefundedVotingBalance = new PrefundedVotingBalanceWASM(indexName, amount)
    }

    if (params.tokenPaymentInfo != null) {
      const { tokenContractId, tokenContractPosition, minimumTokenCost, maximumTokenCost, gasFeesPaidBy } = params.tokenPaymentInfo

      // @ts-expect-error
      params.tokenPaymentInfo = new TokenPaymentInfoWASM(new IdentifierWASM(tokenContractId), tokenContractPosition, minimumTokenCost, maximumTokenCost, gasFeesPaidBy)
    }

    if (params.actionFeeAgreement != null && !(params.actionFeeAgreement instanceof DocumentActionFeeAgreementWASM)) {
      const { owner, moderators, feeMultiplier } = params.actionFeeAgreement

      params.actionFeeAgreement = new DocumentActionFeeAgreementWASM(
        owner,
        moderators,
        feeMultiplier != null ? new AgreedFeeMultiplierWASM(feeMultiplier.knownPermille, feeMultiplier.increaseTolerancePercent) : undefined
      )
    }

    return createStateTransition(document, type, params)
  }

  /**
   * Builds the action fee agreement a document transition must carry when its document type declares
   * `actionFees` for the action (protocol v14): the fee parts the contract declares and the fee multiplier
   * of the current epoch. Pass it as `actionFeeAgreement` to {@link createStateTransition}.
   * Returns undefined when the action charges no fee
   *
   * @param dataContractId {IdentifierLike} Identifier of the Data Contract
   * @param documentType {string} Document type of the data contract
   * @param action {string} Type of the document transition ('create' | 'replace' | 'delete' | 'updatePrice' | 'transfer' | 'purchase')
   * @param increaseTolerancePercent {number=} How far the fee multiplier may grow before execution, in percent (defaults to 0).
   * The network refuses the transition when the multiplier of the executing epoch is higher
   *
   * @return {Promise<DocumentActionFeeAgreementWASM | undefined>}
   */
  async getActionFeeAgreement (dataContractId: IdentifierLike, documentType: string, action: DocumentTransitionType, increaseTolerancePercent?: number): Promise<DocumentActionFeeAgreementWASM | undefined> {
    return await getActionFeeAgreement(this.grpcPool, this.quorumKeyProvider, dataContractId, documentType, action, increaseTolerancePercent ?? 0)
  }
}
