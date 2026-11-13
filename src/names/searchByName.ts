import convertToHomographSafeChars from '../utils/convertToHomographSafeChars.js'
import {DataContractWASM, DocumentWASM, IdentifierLike, WhereClause} from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import query from '../documents/query.js'


export default async function search (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, name: string, contract: IdentifierLike | DataContractWASM): Promise<DocumentWASM[]> {
  const [label, parentDomainName] = name.split('.')

  const normalizedParentDomainName = convertToHomographSafeChars(parentDomainName)
  const normalizedLabelPrefix = convertToHomographSafeChars(label)

  const where: WhereClause[] = [
    ['normalizedParentDomainName', '==', normalizedParentDomainName],
    ['normalizedLabel', 'startsWith', normalizedLabelPrefix]
  ]

  const orderBy = [
    ['normalizedLabel', 'asc']
  ]

  return await query(grpcPool, quorumKeyProvider, contract, 'domain', where, orderBy)
}
