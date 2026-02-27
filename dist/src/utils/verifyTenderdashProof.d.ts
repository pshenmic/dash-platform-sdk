import { Proof, ResponseMetadata } from '../../proto/generated/platform.js';
export default function verifyTenderdashProof(proof: Proof, metadata: ResponseMetadata, rootHash: Uint8Array, quorumPublicKey: string): Promise<boolean>;
