import GRPCConnectionPool from '../grpcConnectionPool.js';
import { IdentifierLike, TokenDirectPurchasePrices } from '../../types.js';
export default function getTokenDirectPurchasePrices(grpcPool: GRPCConnectionPool, tokenIdentifiers: IdentifierLike[]): Promise<TokenDirectPurchasePrices[]>;
