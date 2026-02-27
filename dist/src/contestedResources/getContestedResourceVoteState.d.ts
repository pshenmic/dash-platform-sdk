import { ContestedResourceVoteState, ContestedStateResultType } from '../../types.js';
import GRPCConnectionPool from '../grpcConnectionPool.js';
import { GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo } from '../../proto/generated/platform.js';
import { DataContractWASM } from 'pshenmic-dpp';
export type StartAtIdentifierInfo = GetContestedResourceVoteStateRequest_GetContestedResourceVoteStateRequestV0_StartAtIdentifierInfo;
export default function getContestedResourceVoteState(grpcPool: GRPCConnectionPool, contract: DataContractWASM, documentTypeName: string, indexName: string, indexValues: Array<Uint8Array<ArrayBufferLike>>, resultType: ContestedStateResultType, allowIncludeLockedAndAbstainingVoteTally: boolean, startAtIdentifierInfo?: StartAtIdentifierInfo, count?: number): Promise<ContestedResourceVoteState>;
