import { IdentityWASM, PrivateKeyWASM } from 'pshenmic-dpp';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function registerName(grpcPool: GRPCConnectionPool, name: string, identity: IdentityWASM, privateKey: PrivateKeyWASM): Promise<void>;
