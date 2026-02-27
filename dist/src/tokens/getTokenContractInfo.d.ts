import GRPCConnectionPool from '../grpcConnectionPool.js';
import { IdentifierLike } from '../../types.js';
import { IdentifierWASM } from 'pshenmic-dpp';
export interface TokenContractInfo {
    dataContractId: IdentifierWASM;
    tokenContractPosition: number;
}
export default function getTokenContractInfo(grpcPool: GRPCConnectionPool, tokenIdentifier: IdentifierLike): Promise<TokenContractInfo>;
