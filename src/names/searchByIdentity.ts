import {DataContractWASM, DocumentWASM, IdentifierLike, IdentifierWASM} from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import query from '../documents/query.js'

export default async function searchByIdentity (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, identifier: IdentifierWASM, contract: IdentifierLike | DataContractWASM): Promise<DocumentWASM[]> {
  return await query(
    grpcPool,
    quorumKeyProvider,
    contract,
    'domain',
    [['records.identity', '=', identifier.base58()]],
    [['records.identity', 'asc']]
  )
}
