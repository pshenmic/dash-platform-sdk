import { IdentityWASM } from 'pshenmic-dpp';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function getIdentityByNonUniquePublicKeyHash(grpcPool: GRPCConnectionPool, hex: string): Promise<IdentityWASM>;
