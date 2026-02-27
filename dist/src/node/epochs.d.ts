import GRPCConnectionPool from '../grpcConnectionPool.js';
export interface EpochInfo {
    number: number;
    firstBlockHeight: number;
    firstCoreBlockHeight: number;
    startTime: bigint;
    feeMultiplier: bigint;
    protocolVersion: 9;
}
export default function epochs(grpcPool: GRPCConnectionPool, count: number, ascending: boolean, start?: number): Promise<EpochInfo[]>;
