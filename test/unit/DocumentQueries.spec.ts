import { DataContractWASM, DocumentWASM, IdentifierWASM } from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'

const DOCUMENT_HISTORY = '6voHRaoiPcfmMhbqCA9dixH98xcgPQ9UEcuaXjpVu3LD'
const DPNS = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

function decodeTimestampKey (key: Uint8Array): bigint {
  return new DataView(key.buffer, key.byteOffset, key.byteLength).getBigUint64(0) ^ (1n << 63n)
}

let sdk: DashPlatformSDK

describe('Document queries', () => {
  beforeAll(async () => {
    sdk = new DashPlatformSDK({ network: 'testnet' })
  })

  describe('where operators', () => {
    test('should be able to query with `in`', async () => {
      const documents = await sdk.documents.query(
        DPNS,
        'domain',
        [['normalizedParentDomainName', '==', 'dash'], ['normalizedLabel', 'in', ['dash', 'pshenmic']]],
        [['normalizedLabel', 'asc']],
        5
      )

      expect(documents.length).toBeGreaterThan(0)
      expect(documents[0]).toEqual(expect.any(DocumentWASM))
    })
  })

  describe('count', () => {
    test('should be able to count all documents of a type', async () => {
      // without a where clause the count comes from the document type's primary key tree
      const { mode, entries: [total] } = await sdk.documents.count(DOCUMENT_HISTORY, { documentTypeName: 'transfer' })

      expect(mode).toEqual('primaryKeyTree')
      expect(total.count).toEqual(expect.any(BigInt))
      expect(total.key).toEqual(new Uint8Array())
    })

    test('should be able to count documents matching an equality', async () => {
      // how many DPNS names were ever transferred
      const { entries: [total] } = await sdk.documents.count(DOCUMENT_HISTORY, {
        documentTypeName: 'transfer',
        where: [['dataContractId', '==', DPNS]]
      })

      expect(total.count).toEqual(expect.any(BigInt))
    })

    test('should be able to count documents in a range', async () => {
      // DPNS names transferred in the last 30 days: a range on the last property of a `rangeCountable` index
      const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

      const { mode, entries: [total] } = await sdk.documents.count(DOCUMENT_HISTORY, {
        documentTypeName: 'transfer',
        where: [['dataContractId', '==', DPNS], ['$createdAt', '>', monthAgo]]
      })

      expect(mode).toEqual('aggregate')
      expect(total.count).toEqual(expect.any(BigInt))
    })

    test('should be able to count grouped by an `in` clause', async () => {
      // one entry per contract of the `in` list that has transfers, the contract id is the entry key
      const { entries } = await sdk.documents.count(DOCUMENT_HISTORY, {
        documentTypeName: 'transfer',
        where: [['dataContractId', 'in', [DPNS, DOCUMENT_HISTORY]]],
        groupBy: ['dataContractId']
      })

      const [dpns] = entries

      expect(new IdentifierWASM(dpns.key).base58()).toEqual(DPNS)
      expect(dpns.count).toEqual(expect.any(BigInt))
    })

    test('should be able to count grouped by a range', async () => {
      // one entry per distinct `$createdAt`, `limit` caps the amount of groups
      const { mode, entries } = await sdk.documents.count(DOCUMENT_HISTORY, {
        documentTypeName: 'transfer',
        where: [['dataContractId', '==', DPNS], ['$createdAt', '>', 0]],
        groupBy: ['$createdAt'],
        limit: 3
      })

      expect(mode).toEqual('distinct')
      expect(entries.length).toBeLessThanOrEqual(3)
      expect(decodeTimestampKey(entries[0].key)).toBeGreaterThan(0n)
      expect(entries[0].count).toEqual(expect.any(BigInt))
    })
  })

  describe('sum and average', () => {
    test('should be able to sum a field', async () => {
      // total credits asked for DPNS names in all price updates
      const { entries: [total] } = await sdk.documents.sum(DOCUMENT_HISTORY, {
        documentTypeName: 'priceUpdate',
        where: [['dataContractId', '==', DPNS], ['$createdAt', '>', 0]]
      }, 'price')

      expect(total.sum).toEqual(expect.any(BigInt))
    })

    test('should be able to average a field', async () => {
      // the proof carries the count and the sum, the average is computed by the caller
      const { entries: [total] } = await sdk.documents.average(DOCUMENT_HISTORY, {
        documentTypeName: 'purchase',
        where: [['dataContractId', '==', DPNS], ['$createdAt', '>', 0]]
      }, 'price')

      const { count, sum } = total as { count: bigint, sum: bigint }

      expect(count).toBeGreaterThan(0n)
      expect(sum / count).toEqual(expect.any(BigInt))
    })

    test('should be able to average grouped by an `in` clause', async () => {
      // the `in` value of each group is returned in `inKey`
      const { entries } = await sdk.documents.average(DOCUMENT_HISTORY, {
        documentTypeName: 'priceUpdate',
        where: [['dataContractId', 'in', [DPNS, DOCUMENT_HISTORY]], ['$createdAt', '>', 0]],
        groupBy: ['dataContractId']
      }, 'price')

      const [dpns] = entries

      expect(new IdentifierWASM(dpns.inKey as Uint8Array).base58()).toEqual(DPNS)
      expect(dpns.count).toEqual(expect.any(BigInt))
      expect(dpns.sum).toEqual(expect.any(BigInt))
    })
  })

  describe('composite', () => {
    test('should be able to query a page with a bound sub-query', async () => {
      // page: three DPNS name transfers. Sub-query: purchases of the same names, the page's
      // `documentId` values become an `in` clause on the sub-query's `documentId`
      const { pageDocuments, subResults: [purchases] } = await sdk.documents.composite(
        DOCUMENT_HISTORY,
        {
          documentTypeName: 'transfer',
          where: [['dataContractId', '==', DPNS]],
          orderBy: [['$createdAt', 'asc']],
          limit: 3
        },
        [{
          documentTypeName: 'purchase',
          where: [['dataContractId', '==', DPNS]],
          // a sub-query on a non-unique index needs a limit per bound value
          limit: 2,
          binding: { source: 'page', sourceProperty: 'documentId', field: 'documentId' }
        }]
      )

      expect(pageDocuments.length).toEqual(3)
      expect(pageDocuments[0]).toEqual(expect.any(DocumentWASM))
      expect(Array.isArray(purchases.documents)).toEqual(true)
      expect(Array.isArray(purchases.missingIds)).toEqual(true)
    })

    test('should be able to bind a sub-query of another contract', async () => {
      // page: DPNS domains. Sub-query: their transfers in `document-history`, a contract
      // other than the page's one is passed as `dataContract`
      const history: DataContractWASM = await sdk.dataContracts.getDataContractByIdentifier(DOCUMENT_HISTORY)

      const { pageDocuments, subResults: [transfers] } = await sdk.documents.composite(
        DPNS,
        {
          documentTypeName: 'domain',
          where: [['normalizedParentDomainName', '==', 'dash']],
          orderBy: [['normalizedLabel', 'asc']],
          limit: 3
        },
        [{
          dataContract: history,
          documentTypeName: 'transfer',
          where: [['dataContractId', '==', DPNS]],
          limit: 2,
          binding: { source: 'page', sourceProperty: '$id', field: 'documentId' }
        }]
      )

      expect(pageDocuments.length).toEqual(3)
      expect(Array.isArray(transfers.documents)).toEqual(true)
    })
  })

  /**
   * No contract on testnet declares the indexes these queries need yet, so the examples below
   * show the call and check that the node accepts the request shape and only refuses the missing index
   */
  describe('ranked, having and chained', () => {
    test('ranked: top groups by count', async () => {
      // needs a single-property index on the `groupBy` field
      await expect(sdk.documents.ranked(DOCUMENT_HISTORY, {
        documentTypeName: 'transfer',
        select: { function: 'count' },
        groupBy: ['dataContractId'],
        where: [['dataContractId', 'in', [DPNS, DOCUMENT_HISTORY]]],
        // order by `$count` for count, by the aggregated field for sum and avg
        orderBy: [['$count', 'desc']],
        limit: 2,
        offset: 0
      })).rejects.toThrow(/ranked%20index|ranked index/)
    })

    test('having: groups whose aggregate is within bounds', async () => {
      // needs the same index as ranked, `limit` is required (1 ..= 100)
      await expect(sdk.documents.having(DOCUMENT_HISTORY, {
        documentTypeName: 'transfer',
        select: { function: 'count' },
        groupBy: ['dataContractId'],
        where: [['dataContractId', 'in', [DPNS, DOCUMENT_HISTORY]]],
        having: [{ function: 'count', operator: '>=', value: 10 }],
        limit: 10
      })).rejects.toThrow(/ranked%20index|ranked index/)
    })

    test('chained: documents and the documents they refer to', async () => {
      // the inner document type must be `indexOnly`
      await expect(sdk.documents.chained(
        DPNS,
        { documentTypeName: 'domain', where: [['normalizedParentDomainName', '==', 'dash']], limit: 2 },
        'records.identity',
        'domain'
      )).rejects.toThrow(/indexOnly/)
    })
  })
})
