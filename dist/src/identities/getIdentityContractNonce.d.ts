import { IdentifierLike } from '../../types.js';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function getIdentityContractNonce(grpcPool: GRPCConnectionPool, identity: IdentifierLike, dataContract: IdentifierLike): Promise<bigint>;
