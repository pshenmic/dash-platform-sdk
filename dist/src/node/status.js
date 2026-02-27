import { GetStatusRequest } from '../../proto/generated/platform.js';
import bytesToHex from '../utils/bytesToHex.js';
export default async function status(grpcPool) {
    const getStatusRequest = GetStatusRequest.create({
        version: {
            oneofKind: 'v0',
            v0: {}
        }
    });
    const { response } = await grpcPool.getClient().getStatus(getStatusRequest);
    const { version } = response;
    if (version.oneofKind !== 'v0') {
        throw new Error('Unexpected oneOf type returned from DAPI (must be v0)');
    }
    const { v0 } = version;
    return {
        node: (v0.node != null)
            ? {
                id: bytesToHex(v0.node.id),
                proTxHash: v0.node.proTxHash != null ? bytesToHex(v0.node.proTxHash) : undefined
            }
            : undefined,
        chain: (v0.chain != null)
            ? {
                catchingUp: v0.chain.catchingUp,
                latestBlockHeight: v0.chain.latestBlockHeight,
                earliestBlockHeight: v0.chain.earliestBlockHeight,
                maxPeerBlockHeight: v0.chain.maxPeerBlockHeight,
                coreChainLockedHeight: v0.chain.coreChainLockedHeight,
                latestBlockHash: v0.chain?.latestBlockHash != null ? bytesToHex(v0.chain?.latestBlockHash) : '',
                latestAppHash: v0.chain?.latestAppHash != null ? bytesToHex(v0.chain?.latestAppHash) : '',
                earliestBlockHash: v0.chain?.earliestBlockHash != null ? bytesToHex(v0.chain?.earliestBlockHash) : '',
                earliestAppHash: v0.chain?.earliestAppHash != null ? bytesToHex(v0.chain?.earliestAppHash) : ''
            }
            : undefined,
        version: v0.version,
        network: v0.network,
        stateSync: v0.stateSync,
        time: v0.time
    };
}
