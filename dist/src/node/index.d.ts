import GRPCConnectionPool from '../grpcConnectionPool.js';
import { Network, NodeStatus } from '../../types.js';
import { EpochInfo } from './epochs.js';
/**
 * Node controller for requesting information about DAPI node
 *
 * @hideconstructor
 */
export declare class NodeController {
    /** @ignore **/
    grpcPool: GRPCConnectionPool;
    network: Network;
    constructor(grpcPool: GRPCConnectionPool, network: Network);
    /**
     * Retrieves an info about node
     * Includes information about genesis, chain, software versions
     *
     * @return {Promise<NodeStatus>}
     */
    status(): Promise<NodeStatus>;
    /**
     * Returns total credits amount in platform
     *
     * @return {Promise<bigint>}
     */
    totalCredits(): Promise<bigint>;
    /**
     * Retrieves an info about epochs
     * Includes information about first block height, time, fee multiplier, number
     *
     * @return {Promise<EpochInfo[]>}
     */
    getEpochsInfo(count: number, ascending: boolean, start?: number): Promise<EpochInfo[]>;
}
