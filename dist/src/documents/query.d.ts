import { DocumentWASM, IdentifierWASM, WhereClause } from 'pshenmic-dpp';
import { IdentifierLike } from '../../types.js';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function query(grpcPool: GRPCConnectionPool, dataContractId: IdentifierLike, documentTypeName: string, where?: WhereClause[], orderBy?: string[][], limit?: number | undefined, startAt?: IdentifierWASM, startAfter?: IdentifierWASM): Promise<DocumentWASM[]>;
