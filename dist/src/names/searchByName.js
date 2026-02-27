import convertToHomographSafeChars from '../utils/convertToHomographSafeChars.js';
import query from '../documents/query.js';
const DPNS_DATA_CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec';
export default async function search(grpcPool, name) {
    const [label, parentDomainName] = name.split('.');
    const normalizedParentDomainName = convertToHomographSafeChars(parentDomainName);
    const normalizedLabelPrefix = convertToHomographSafeChars(label);
    const where = [
        ['normalizedParentDomainName', '==', normalizedParentDomainName],
        ['normalizedLabel', 'startsWith', normalizedLabelPrefix]
    ];
    const orderBy = [
        ['normalizedLabel', 'asc']
    ];
    return await query(grpcPool, DPNS_DATA_CONTRACT_ID, 'domain', where, orderBy);
}
