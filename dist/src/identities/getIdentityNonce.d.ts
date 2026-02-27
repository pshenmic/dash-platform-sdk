import { IdentifierLike } from '../../types.js';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function getIdentityNonce(grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<bigint>;
