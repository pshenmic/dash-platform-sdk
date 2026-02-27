import { DocumentWASM } from 'pshenmic-dpp';
export default function createDocument(dataContractId, documentType, data, owner, revision, documentId) {
    return new DocumentWASM(data, documentType, revision ?? BigInt(1), dataContractId, owner, documentId, owner);
}
