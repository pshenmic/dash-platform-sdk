import GRPCConnectionPool from '../grpcConnectionPool.js';
import { IdentifierLike } from '../../types.js';
import { IdentifierWASM } from 'pshenmic-dpp';
export interface IdentityTokenBalances {
    tokenId: IdentifierWASM;
    balance?: bigint | undefined;
}
export default function getIdentityTokensBalances(grpcPool: GRPCConnectionPool, identifier: IdentifierLike, tokenIdentifiers: IdentifierLike[]): Promise<IdentityTokenBalances[]>;
