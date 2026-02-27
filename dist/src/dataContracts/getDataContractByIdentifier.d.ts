import { DataContractWASM } from 'pshenmic-dpp';
import { IdentifierLike } from '../../types.js';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function getByIdentifier(grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<DataContractWASM>;
