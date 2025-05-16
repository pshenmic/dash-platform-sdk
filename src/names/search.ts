import convertToHomographSafeChars from '../utils/convertToHomographSafeChars'
import query from '../documents/get'
import { DocumentWASM } from 'pshenmic-dpp'

const DPNS_DATA_CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

export default async function search (name: string): Promise<[DocumentWASM]> {
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

  return query.bind(this)(DPNS_DATA_CONTRACT_ID, 'domain', where, orderBy)
}
