import { IdentityWASM } from 'pshenmic-dpp';
import { IdentifierLike } from '../../types.js';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function getIdentityByIdentifier(grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<IdentityWASM>;
