import {
  GetDocumentsRequest,
  GetDocumentsRequest_DocumentFieldValue,
  GetDocumentsRequest_GetDocumentsRequestV1,
  GetDocumentsRequest_GetDocumentsRequestV1_Select_Function,
  GetDocumentsRequest_GetDocumentsRequestV1_SubQuery,
  GetDocumentsRequest_GetDocumentsRequestV1_SubQuery_Kind,
  GetDocumentsRequest_HavingAggregate_Function,
  GetDocumentsRequest_HavingClause,
  GetDocumentsRequest_HavingClause_Operator,
  GetDocumentsRequest_IntegerRangeSelection,
  GetDocumentsRequest_OrderClause,
  GetDocumentsRequest_TimeRangeSelection,
  GetDocumentsRequest_TimeRangeSelection_Selector,
  GetDocumentsRequest_WhereClause,
  GetDocumentsRequest_WhereOperator,
  Proof,
  ResponseMetadata
} from '../../proto/generated/platform.js'
import {
  AggregateSelect,
  CompositeSubQuery,
  HavingClause,
  IdentifierLike,
  IdentifierWASM,
  IntegerRangeSelection,
  TimeRangeSelection,
  WhereClause
} from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'

type DocumentFieldValue = GetDocumentsRequest_DocumentFieldValue

const WHERE_OPERATORS: Record<string, GetDocumentsRequest_WhereOperator> = {
  '=': GetDocumentsRequest_WhereOperator.EQUAL,
  '==': GetDocumentsRequest_WhereOperator.EQUAL,
  '>': GetDocumentsRequest_WhereOperator.GREATER_THAN,
  '>=': GetDocumentsRequest_WhereOperator.GREATER_THAN_OR_EQUALS,
  '<': GetDocumentsRequest_WhereOperator.LESS_THAN,
  '<=': GetDocumentsRequest_WhereOperator.LESS_THAN_OR_EQUALS,
  between: GetDocumentsRequest_WhereOperator.BETWEEN,
  betweenexcludebounds: GetDocumentsRequest_WhereOperator.BETWEEN_EXCLUDE_BOUNDS,
  betweenexcludeleft: GetDocumentsRequest_WhereOperator.BETWEEN_EXCLUDE_LEFT,
  betweenexcluderight: GetDocumentsRequest_WhereOperator.BETWEEN_EXCLUDE_RIGHT,
  in: GetDocumentsRequest_WhereOperator.IN,
  startswith: GetDocumentsRequest_WhereOperator.STARTS_WITH,
  contains: GetDocumentsRequest_WhereOperator.CONTAINS,
  containsany: GetDocumentsRequest_WhereOperator.CONTAINS_ANY,
  intimerange: GetDocumentsRequest_WhereOperator.IN_TIME_RANGE,
  inintegerrange: GetDocumentsRequest_WhereOperator.IN_INTEGER_RANGE
}

const HAVING_OPERATORS: Record<string, GetDocumentsRequest_HavingClause_Operator> = {
  '=': GetDocumentsRequest_HavingClause_Operator.EQUAL,
  '!=': GetDocumentsRequest_HavingClause_Operator.NOT_EQUAL,
  '>': GetDocumentsRequest_HavingClause_Operator.GREATER_THAN,
  '>=': GetDocumentsRequest_HavingClause_Operator.GREATER_THAN_OR_EQUALS,
  '<': GetDocumentsRequest_HavingClause_Operator.LESS_THAN,
  '<=': GetDocumentsRequest_HavingClause_Operator.LESS_THAN_OR_EQUALS,
  between: GetDocumentsRequest_HavingClause_Operator.BETWEEN,
  betweenexcludebounds: GetDocumentsRequest_HavingClause_Operator.BETWEEN_EXCLUDE_BOUNDS,
  betweenexcludeleft: GetDocumentsRequest_HavingClause_Operator.BETWEEN_EXCLUDE_LEFT,
  betweenexcluderight: GetDocumentsRequest_HavingClause_Operator.BETWEEN_EXCLUDE_RIGHT,
  in: GetDocumentsRequest_HavingClause_Operator.IN
}

const SELECT_FUNCTIONS: Record<AggregateSelect['function'], GetDocumentsRequest_GetDocumentsRequestV1_Select_Function> = {
  count: GetDocumentsRequest_GetDocumentsRequestV1_Select_Function.COUNT,
  sum: GetDocumentsRequest_GetDocumentsRequestV1_Select_Function.SUM,
  avg: GetDocumentsRequest_GetDocumentsRequestV1_Select_Function.AVG,
  min: GetDocumentsRequest_GetDocumentsRequestV1_Select_Function.MIN,
  max: GetDocumentsRequest_GetDocumentsRequestV1_Select_Function.MAX
}

const HAVING_FUNCTIONS: Record<HavingClause['function'], GetDocumentsRequest_HavingAggregate_Function> = {
  count: GetDocumentsRequest_HavingAggregate_Function.COUNT,
  sum: GetDocumentsRequest_HavingAggregate_Function.SUM,
  avg: GetDocumentsRequest_HavingAggregate_Function.AVG
}

function normalizeOperator (operator: string): string {
  return operator.toLowerCase().replace(/_/g, '')
}

/**
 * Converts a JS value of a where / having clause into a typed v1 document field value
 */
export function toFieldValue (value: unknown): DocumentFieldValue {
  if (value == null) {
    return { variant: { oneofKind: 'nullValue', nullValue: true } }
  }

  if (typeof value === 'boolean') {
    return { variant: { oneofKind: 'boolValue', boolValue: value } }
  }

  if (typeof value === 'bigint' || (typeof value === 'number' && Number.isInteger(value))) {
    return value < 0
      ? { variant: { oneofKind: 'int64Value', int64Value: value.toString() } }
      : { variant: { oneofKind: 'uint64Value', uint64Value: value.toString() } }
  }

  if (typeof value === 'number') {
    return { variant: { oneofKind: 'doubleValue', doubleValue: value } }
  }

  if (typeof value === 'string') {
    return { variant: { oneofKind: 'text', text: value } }
  }

  if (value instanceof Uint8Array) {
    return { variant: { oneofKind: 'bytesValue', bytesValue: value } }
  }

  if (Array.isArray(value)) {
    return { variant: { oneofKind: 'list', list: { values: value.map(toFieldValue) } } }
  }

  throw new Error(`Unsupported where clause value: ${String(value)}`)
}

function toTimeRangeSelection (selection: TimeRangeSelection): GetDocumentsRequest_TimeRangeSelection {
  if (selection === 'newest' || selection === 'oldest') {
    return GetDocumentsRequest_TimeRangeSelection.create({
      selector: selection === 'newest'
        ? GetDocumentsRequest_TimeRangeSelection_Selector.NEWEST
        : GetDocumentsRequest_TimeRangeSelection_Selector.OLDEST
    })
  }

  if (typeof selection === 'bigint') {
    return GetDocumentsRequest_TimeRangeSelection.create({
      selector: GetDocumentsRequest_TimeRangeSelection_Selector.BY_START,
      startMs: selection.toString()
    })
  }

  const selectors = {
    newest: GetDocumentsRequest_TimeRangeSelection_Selector.NEWEST,
    oldest: GetDocumentsRequest_TimeRangeSelection_Selector.OLDEST,
    byStart: GetDocumentsRequest_TimeRangeSelection_Selector.BY_START
  }

  return GetDocumentsRequest_TimeRangeSelection.create({
    selector: selectors[selection.selector ?? 'byStart'],
    startMs: selection.startMs?.toString(),
    grid: selection.grid != null
      ? {
          range: selection.grid.rangeSeconds.toString(),
          step: selection.grid.stepSeconds.toString(),
          phase: (selection.grid.phaseSeconds ?? 0).toString()
        }
      : undefined
  })
}

function toIntegerRangeSelection (selection: IntegerRangeSelection): GetDocumentsRequest_IntegerRangeSelection {
  if (typeof selection === 'bigint' || typeof selection === 'number') {
    return GetDocumentsRequest_IntegerRangeSelection.create({ start: toFieldValue(selection) })
  }

  return GetDocumentsRequest_IntegerRangeSelection.create({
    start: toFieldValue(selection.start),
    grid: selection.grid != null
      ? {
          range: selection.grid.range.toString(),
          step: selection.grid.step.toString(),
          phase: (selection.grid.phase ?? 0).toString()
        }
      : undefined
  })
}

/**
 * Converts `[field, operator, value]` where clauses into typed v1 where clauses
 */
export function toWhereClauses (where?: WhereClause[] | null): GetDocumentsRequest_WhereClause[] {
  return (where ?? []).map(([field, operator, value]) => {
    const op = WHERE_OPERATORS[normalizeOperator(operator)]

    if (op == null) {
      throw new Error(`Unsupported where clause operator: ${operator}`)
    }

    if (op === GetDocumentsRequest_WhereOperator.IN_TIME_RANGE) {
      return GetDocumentsRequest_WhereClause.create({ field, operator: op, timeRange: toTimeRangeSelection(value as TimeRangeSelection) })
    }

    if (op === GetDocumentsRequest_WhereOperator.IN_INTEGER_RANGE) {
      return GetDocumentsRequest_WhereClause.create({ field, operator: op, integerRange: toIntegerRangeSelection(value as IntegerRangeSelection) })
    }

    return GetDocumentsRequest_WhereClause.create({ field, operator: op, value: toFieldValue(value) })
  })
}

/**
 * Converts `[field, 'asc' | 'desc']` order by clauses into typed v1 order clauses.
 * For ranked queries the selected aggregate is ordered by its field, or by `$count` for `count`
 */
export function toOrderClauses (orderBy?: string[][] | null): GetDocumentsRequest_OrderClause[] {
  return (orderBy ?? []).map(([field, direction]) => ({
    target: { oneofKind: 'field', field },
    ascending: direction?.toLowerCase() !== 'desc'
  }))
}

export function toSelect (select: AggregateSelect): GetDocumentsRequest_GetDocumentsRequestV1['selects'] {
  return [{ function: SELECT_FUNCTIONS[select.function], field: select.field ?? '' }]
}

export function toHavingClauses (having: HavingClause[]): GetDocumentsRequest_HavingClause[] {
  return having.map(clause => {
    const operator = HAVING_OPERATORS[normalizeOperator(clause.operator)]

    if (operator == null) {
      throw new Error(`Unsupported having clause operator: ${clause.operator}`)
    }

    return {
      aggregate: { function: HAVING_FUNCTIONS[clause.function], field: clause.field ?? '' },
      operator,
      right: { oneofKind: 'value', value: toFieldValue(clause.value) }
    }
  })
}

export function toSubQueries (subQueries: CompositeSubQuery[], dataContractId: IdentifierWASM): GetDocumentsRequest_GetDocumentsRequestV1_SubQuery[] {
  return subQueries.map(subQuery => ({
    dataContractId: (subQuery.dataContract?.id ?? dataContractId).bytes(),
    documentType: subQuery.documentTypeName,
    whereClauses: toWhereClauses(subQuery.where),
    orderBy: toOrderClauses(subQuery.orderBy),
    limit: subQuery.limit,
    kind: subQuery.kind === 'count'
      ? GetDocumentsRequest_GetDocumentsRequestV1_SubQuery_Kind.COUNT
      : GetDocumentsRequest_GetDocumentsRequestV1_SubQuery_Kind.DOCUMENTS,
    // on the wire `0` is the page and `n` is `subQueries[n - 1]`
    bind: subQuery.binding != null
      ? {
          source: subQuery.binding.source === 'page' ? 0 : subQuery.binding.source + 1,
          sourceProperty: subQuery.binding.sourceProperty,
          field: subQuery.binding.field
        }
      : undefined
  }))
}

export function toStart (startAt?: IdentifierLike | null, startAtIncluded?: boolean): GetDocumentsRequest_GetDocumentsRequestV1['start'] {
  if (startAt == null) {
    return { oneofKind: undefined }
  }

  const bytes = new IdentifierWASM(startAt).bytes()

  return startAtIncluded === false
    ? { oneofKind: 'startAfter', startAfter: bytes }
    : { oneofKind: 'startAt', startAt: bytes }
}

/**
 * Sends a v1 getDocuments request with a proof and returns the proof with the response metadata
 */
export async function getDocumentsV1Proof (
  grpcPool: GRPCPool,
  v1: Partial<GetDocumentsRequest_GetDocumentsRequestV1>
): Promise<{ proof: Proof, metadata: ResponseMetadata }> {
  const getDocumentsRequest = GetDocumentsRequest.create({
    version: {
      oneofKind: 'v1',
      v1: GetDocumentsRequest_GetDocumentsRequestV1.create({ ...v1, prove: true })
    }
  })

  const { response } = await (await grpcPool.getClient()).getDocuments(getDocumentsRequest)

  const { version } = response

  if (version.oneofKind !== 'v1') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v1)')
  }

  const { v1: { result, metadata } } = version

  if (result.oneofKind !== 'proof') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be proof)')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  return { proof: result.proof, metadata }
}

/**
 * Verifies the quorum signature of a proof whose GroveDB part produced the given root hash
 */
export async function verifyDocumentsV1Signature (quorumKeyProvider: QuorumKeyProvider, proof: Proof, metadata: ResponseMetadata, rootHash: Uint8Array): Promise<void> {
  const quorumPublicKey = await quorumKeyProvider.getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }
}
