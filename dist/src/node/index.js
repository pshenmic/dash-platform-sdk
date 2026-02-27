import getStatus from './status.js';
import getEpochsInfo from './epochs.js';
import getTotalCredits from './totalCredits.js';
/**
 * Node controller for requesting information about DAPI node
 *
 * @hideconstructor
 */
export class NodeController {
    /** @ignore **/
    grpcPool;
    network;
    constructor(grpcPool, network) {
        this.grpcPool = grpcPool;
        this.network = network;
    }
    /**
     * Retrieves an info about node
     * Includes information about genesis, chain, software versions
     *
     * @return {Promise<NodeStatus>}
     */
    async status() {
        return await getStatus(this.grpcPool);
    }
    /**
     * Returns total credits amount in platform
     *
     * @return {Promise<bigint>}
     */
    async totalCredits() {
        return await getTotalCredits(this.grpcPool, this.network);
    }
    /**
     * Retrieves an info about epochs
     * Includes information about first block height, time, fee multiplier, number
     *
     * @return {Promise<EpochInfo[]>}
     */
    async getEpochsInfo(count, ascending, start) {
        return await getEpochsInfo(this.grpcPool, count, ascending, start);
    }
}
