import { IdentifierWASM } from 'pshenmic-dpp'
import {
  GetDocumentsRequest_GetDocumentsRequestV1_Select_Function,
  GetDocumentsRequest_GetDocumentsRequestV1_SubQuery_Kind,
  GetDocumentsRequest_HavingClause_Operator,
  GetDocumentsRequest_TimeRangeSelection_Selector,
  GetDocumentsRequest_WhereOperator
} from '../../proto/generated/platform.js'
import {
  toFieldValue,
  toHavingClauses,
  toOrderClauses,
  toSelect,
  toStart,
  toSubQueries,
  toWhereClauses
} from '../../src/documents/v1.js'

describe('Documents V1 request conversion', () => {
  test('should convert field values', () => {
    expect(toFieldValue(true).variant).toEqual({ oneofKind: 'boolValue', boolValue: true })
    expect(toFieldValue(5).variant).toEqual({ oneofKind: 'uint64Value', uint64Value: '5' })
    expect(toFieldValue(-5n).variant).toEqual({ oneofKind: 'int64Value', int64Value: '-5' })
    expect(toFieldValue(1.5).variant).toEqual({ oneofKind: 'doubleValue', doubleValue: 1.5 })
    expect(toFieldValue('dash').variant).toEqual({ oneofKind: 'text', text: 'dash' })
    expect(toFieldValue(new Uint8Array([1])).variant).toEqual({ oneofKind: 'bytesValue', bytesValue: new Uint8Array([1]) })
    expect(toFieldValue(null).variant).toEqual({ oneofKind: 'nullValue', nullValue: true })
    expect(toFieldValue(['a', 1]).variant).toEqual({
      oneofKind: 'list',
      list: { values: [toFieldValue('a'), toFieldValue(1)] }
    })
    expect(() => toFieldValue({})).toThrow()
  })

  test('should convert where clauses', () => {
    const [equal, startsWith, containsAny] = toWhereClauses([
      ['normalizedParentDomainName', '==', 'dash'],
      ['normalizedLabel', 'startsWith', 'a'],
      ['tags', 'contains_any', ['x', 'y']]
    ])

    expect(equal).toEqual({ field: 'normalizedParentDomainName', operator: GetDocumentsRequest_WhereOperator.EQUAL, value: toFieldValue('dash') })
    expect(startsWith.operator).toEqual(GetDocumentsRequest_WhereOperator.STARTS_WITH)
    expect(containsAny.operator).toEqual(GetDocumentsRequest_WhereOperator.CONTAINS_ANY)
    expect(toWhereClauses(undefined)).toEqual([])
    // @ts-expect-error
    expect(() => toWhereClauses([['a', 'like', 'b']])).toThrow()
  })

  test('should convert time and integer range where clauses', () => {
    const [newest, byStart, grid, integer] = toWhereClauses([
      ['$createdAt', 'inTimeRange', 'newest'],
      ['$createdAt', 'IN_TIME_RANGE', 1700000000000n],
      ['$createdAt', 'in_time_range', { selector: 'oldest', grid: { rangeSeconds: 3600, stepSeconds: 60 } }],
      ['height', 'inIntegerRange', { start: 100, grid: { range: 10, step: 10 } }]
    ])

    expect(newest.operator).toEqual(GetDocumentsRequest_WhereOperator.IN_TIME_RANGE)
    expect(newest.value).toEqual(undefined)
    expect(newest.timeRange?.selector).toEqual(GetDocumentsRequest_TimeRangeSelection_Selector.NEWEST)
    expect(byStart.timeRange).toEqual(expect.objectContaining({ selector: GetDocumentsRequest_TimeRangeSelection_Selector.BY_START, startMs: '1700000000000' }))
    expect(grid.timeRange?.grid).toEqual({ range: '3600', step: '60', phase: '0' })
    expect(integer.operator).toEqual(GetDocumentsRequest_WhereOperator.IN_INTEGER_RANGE)
    expect(integer.integerRange).toEqual({ start: toFieldValue(100), grid: { range: '10', step: '10', phase: '0' } })
  })

  test('should convert order, select and having clauses', () => {
    expect(toOrderClauses([['$count', 'desc'], ['name', 'asc']])).toEqual([
      { target: { oneofKind: 'field', field: '$count' }, ascending: false },
      { target: { oneofKind: 'field', field: 'name' }, ascending: true }
    ])
    expect(toSelect({ function: 'sum', field: 'amount' })).toEqual([
      { function: GetDocumentsRequest_GetDocumentsRequestV1_Select_Function.SUM, field: 'amount' }
    ])
    expect(toSelect({ function: 'count' })[0].field).toEqual('')

    const [having] = toHavingClauses([{ function: 'count', operator: '>=', value: 10 }])

    expect(having.operator).toEqual(GetDocumentsRequest_HavingClause_Operator.GREATER_THAN_OR_EQUALS)
    expect(having.right).toEqual({ oneofKind: 'value', value: toFieldValue(10) })
  })

  test('should convert start and sub-queries', () => {
    const id = new IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')

    expect(toStart(undefined)).toEqual({ oneofKind: undefined })
    expect(toStart(id, true)).toEqual({ oneofKind: 'startAt', startAt: id.bytes() })
    expect(toStart(id, false)).toEqual({ oneofKind: 'startAfter', startAfter: id.bytes() })

    const [fromPage, fromSubQuery] = toSubQueries([
      { documentTypeName: 'domain', binding: { source: 'page', sourceProperty: '$ownerId', field: '$ownerId' } },
      { documentTypeName: 'preorder', kind: 'count', binding: { source: 0, sourceProperty: '$id', field: '$id' } }
    ], id)

    expect(fromPage.dataContractId).toEqual(id.bytes())
    expect(fromPage.kind).toEqual(GetDocumentsRequest_GetDocumentsRequestV1_SubQuery_Kind.DOCUMENTS)
    expect(fromPage.bind?.source).toEqual(0)
    expect(fromSubQuery.kind).toEqual(GetDocumentsRequest_GetDocumentsRequestV1_SubQuery_Kind.COUNT)
    expect(fromSubQuery.bind?.source).toEqual(1)
  })
})
