import { GetIdentityNonceRequest } from '../../proto/generated/platform.js';
import { IdentifierWASM, verifyIdentityNonceProof } from 'pshenmic-dpp';
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js';
import bytesToHex from '../utils/bytesToHex.js';
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js';
import { LATEST_PLATFORM_VERSION } from '../constants.js';
const IDENTITY_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF);
export default async function getIdentityNonce(grpcPool, identifier) {
    const id = new IdentifierWASM(identifier);
    const getIdentityNonceRequest = GetIdentityNonceRequest.create({
        version: {
            oneofKind: 'v0',
            v0: {
                identityId: id.bytes(),
                prove: true
            }
        }
    });
    const { response } = await grpcPool.getClient().getIdentityNonce(getIdentityNonceRequest);
    const { version } = response;
    if (version.oneofKind !== 'v0') {
        throw new Error('Unexpected oneOf type returned from DAPI (must be v0)');
    }
    const { v0 } = version;
    if (v0.result.oneofKind !== 'proof') {
        throw new Error('Unexpected oneOf type returned from DAPI (must be proof)');
    }
    const { result: { proof }, metadata } = v0;
    if (metadata == null) {
        throw new Error('Metadata not found');
    }
    const { rootHash, nonce } = verifyIdentityNonceProof(proof.grovedbProof, id.bytes(), true, LATEST_PLATFORM_VERSION);
    if (nonce == null) {
        return BigInt(0);
    }
    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash));
    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey);
    if (!verify) {
        throw new Error('Failed to verify query');
    }
    return BigInt(nonce) & IDENTITY_NONCE_VALUE_FILTER;
}
