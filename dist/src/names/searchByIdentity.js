import query from '../documents/query.js';
const DPNS_DATA_CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec';
export default async function searchByIdentity(grpcPool, identifier) {
    return await query(grpcPool, DPNS_DATA_CONTRACT_ID, 'domain', [['records.identity', '=', identifier.base58()]], [['records.identity', 'asc']]);
}
