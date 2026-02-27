import { GetDocumentsRequest } from '../../proto/generated/platform.js';
import { IdentifierWASM, verifyDocumentsProof } from 'pshenmic-dpp';
import { DAPI_DEFAULT_LIMIT, LATEST_PLATFORM_VERSION } from '../constants.js';
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js';
import bytesToHex from '../utils/bytesToHex.js';
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js';
import { encode } from 'cbor-x';
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js';
export default async function query(grpcPool, dataContractId, documentTypeName, where, orderBy, limit = 100, startAt, startAfter) {
    if ([startAt, startAfter].filter(e => e != null).length === 2) {
        throw new Error('Only startAt or startAfter could be specified at one time');
    }
    let start;
    if (startAt != null) {
        start = {
            oneofKind: 'startAt',
            startAt: startAt.base58()
        };
    }
    if (startAfter != null) {
        start = {
            oneofKind: 'startAfter',
            startAt: startAfter.base58()
        };
    }
    const getDocumentsRequest = GetDocumentsRequest.create({
        version: {
            oneofKind: 'v0',
            v0: {
                dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
                documentType: documentTypeName,
                where: encode(where),
                orderBy: encode(orderBy),
                limit: limit ?? DAPI_DEFAULT_LIMIT,
                start,
                prove: true
            }
        }
    });
    const dataContract = await getDataContractByIdentifier(grpcPool, dataContractId);
    const { response } = await grpcPool.getClient().getDocuments(getDocumentsRequest);
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
    const startAtIncluded = startAt != null;
    const { rootHash, documents } = verifyDocumentsProof(proof.grovedbProof, dataContract, documentTypeName, where, orderBy, limit, startAt?.bytes(), startAtIncluded, BigInt(metadata?.timeMs), LATEST_PLATFORM_VERSION);
    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash));
    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey);
    if (!verify) {
        throw new Error('Failed to verify query');
    }
    return documents ?? [];
}
