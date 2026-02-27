import { DocumentWASM, IdentifierWASM } from 'pshenmic-dpp';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function searchByIdentity(grpcPool: GRPCConnectionPool, identifier: IdentifierWASM): Promise<DocumentWASM[]>;
