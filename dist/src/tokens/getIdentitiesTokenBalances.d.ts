import GRPCConnectionPool from '../grpcConnectionPool.js';
import { IdentifierLike } from '../../types.js';
import { IdentifierWASM } from 'pshenmic-dpp';
export interface IdentitiesTokenBalances {
    identityId: IdentifierWASM;
    balance?: bigint | undefined;
}
export default function getIdentitiesTokenBalances(grpcPool: GRPCConnectionPool, identifiers: IdentifierLike[], tokenIdentifier: IdentifierLike): Promise<IdentitiesTokenBalances[]>;
