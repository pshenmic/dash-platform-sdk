import { IdentifierLike } from '../../types.js';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function getIdentityBalance(grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<bigint>;
