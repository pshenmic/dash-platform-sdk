import { GetIdentityRequest } from '../../proto/generated/platform.js';
import { IdentifierWASM, verifyIdentityByIdentifierProof } from 'pshenmic-dpp';
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js';
import bytesToHex from '../utils/bytesToHex.js';
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js';
import { LATEST_PLATFORM_VERSION } from '../constants.js';
export default async function getIdentityByIdentifier(grpcPool, identifier) {
    const id = new IdentifierWASM(identifier);
    const getIdentityRequest = GetIdentityRequest.create({
        version: {
            oneofKind: 'v0',
            v0: {
                id: id.bytes(),
                prove: true
            }
        }
    });
    const { response } = await grpcPool.getClient().getIdentity(getIdentityRequest);
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
    const { rootHash, identity } = verifyIdentityByIdentifierProof(proof.grovedbProof, id, true, LATEST_PLATFORM_VERSION);
    if (identity == null) {
        throw new Error(`Identity with identifier ${id.base58()} not found`);
    }
    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash));
    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey);
    if (!verify) {
        throw new Error('Failed to verify query');
    }
    return identity;
}
