import { DocumentWASM } from 'pshenmic-dpp';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function search(grpcPool: GRPCConnectionPool, name: string): Promise<DocumentWASM[]>;
