import { IdentityPublicKeyWASM } from 'pshenmic-dpp';
import { IdentifierLike } from '../../types.js';
import GRPCConnectionPool from '../grpcConnectionPool.js';
export default function getIdentityPublicKeys(grpcPool: GRPCConnectionPool, identifier: IdentifierLike, keyIds?: number[]): Promise<IdentityPublicKeyWASM[]>;
