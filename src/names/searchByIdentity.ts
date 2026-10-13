import { DocumentWASM, IdentifierWASM } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import query from '../documents/query.js'

const DPNS_DATA_CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

export default async function searchByIdentity (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, identifier: IdentifierWASM): Promise<DocumentWASM[]> {
  return await query(grpcPool, quorumKeyProvider, DPNS_DATA_CONTRACT_ID, 'domain', [['records.identity', '=', identifier.base58()]], [['records.identity', 'asc']])
}
