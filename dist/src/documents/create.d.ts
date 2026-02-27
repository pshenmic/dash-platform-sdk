import { DocumentWASM } from 'pshenmic-dpp';
import { IdentifierLike } from '../../types.js';
export default function createDocument(dataContractId: IdentifierLike, documentType: string, data: object, owner: IdentifierLike, revision?: bigint, documentId?: IdentifierLike): DocumentWASM;
