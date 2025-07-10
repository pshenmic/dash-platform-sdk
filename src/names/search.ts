import convertToHomographSafeChars from '../utils/convertToHomographSafeChars'
import { DocumentWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool'
import query from '../documents/query'

const DPNS_DATA_CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

export default async function search (grpcPool: GRPCConnectionPool, name: string): Promise<DocumentWASM[]> {
  const [label, parentDomainName] = name.split('.')

  const normalizedParentDomainName = convertToHomographSafeChars(parentDomainName)
  const normalizedLabelPrefix = convertToHomographSafeChars(label)

  const where = [
    ['normalizedParentDomainName', '==', normalizedParentDomainName],
    ['normalizedLabel', 'startsWith', normalizedLabelPrefix]
  ]

  const orderBy = [
    ['normalizedLabel', 'asc']
  ]

  return await query(grpcPool, DPNS_DATA_CONTRACT_ID, 'domain', where, orderBy)
}
