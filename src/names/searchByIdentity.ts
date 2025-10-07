import { DocumentWASM, IdentifierWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool'
import query from '../documents/query'

const DPNS_DATA_CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

export default async function searchByIdentity (grpcPool: GRPCConnectionPool, identifier: IdentifierWASM): Promise<DocumentWASM[]> {
  return await query(grpcPool, DPNS_DATA_CONTRACT_ID, 'domain', [['records.identity', '=', identifier.base58()]], [['records.identity', 'asc']])
}
