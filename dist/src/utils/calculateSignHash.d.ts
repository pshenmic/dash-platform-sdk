import { CanonicalVote } from '../../proto/generated/platform.js';
export declare function calculateSignHash(commit: CanonicalVote, chainId: string, quorumType: number, quorumHash: Uint8Array, height: bigint, round: number): Promise<Uint8Array>;
