import GRPCConnectionPool from '../grpcConnectionPool.js';
import { IdentifierLike, TokenTotalSupply } from '../../types.js';
export default function getTokenTotalSupply(grpcPool: GRPCConnectionPool, tokenIdentifier: IdentifierLike): Promise<TokenTotalSupply>;
