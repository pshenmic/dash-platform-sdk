import { NodeStatus } from '../../types.js';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function status(grpcPool: GRPCConnectionPool): Promise<NodeStatus>;
