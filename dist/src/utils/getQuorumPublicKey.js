const cache = {};
export async function getQuorumPublicKey(network, quorumType, quorumHash) {
    const cached = cache[`${quorumType}_${quorumHash}`];
    if (cached != null) {
        return cached;
    }
    const url = `https://${network === 'mainnet' ? '' : 'testnet.'}platform-explorer.pshenmic.dev/quorum/info?quorumType=${quorumType}&quorumHash=${quorumHash}`;
    const resp = await fetch(url, {
        method: 'GET'
    });
    if (resp.status !== 200) {
        throw new Error('Failed to query Platform Explorer for quorum public keys');
    }
    const data = await resp.json();
    const { quorumPublicKey } = data;
    cache[`${quorumType}_${quorumHash}`] = quorumPublicKey;
    return quorumPublicKey;
}
