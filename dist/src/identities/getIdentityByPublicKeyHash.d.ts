import { IdentityWASM } from 'pshenmic-dpp';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function getIdentityByPublicKeyHash(grpcPool: GRPCConnectionPool, hex: string): Promise<IdentityWASM>;
