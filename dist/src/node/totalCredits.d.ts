import GRPCConnectionPool from '../grpcConnectionPool.js';
import { Network } from '../../types.js';
export default function totalCredits(grpcPool: GRPCConnectionPool, network: Network): Promise<bigint>;
