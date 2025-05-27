import {DocumentCreateTransitionWASM, DocumentWASM} from "pshenmic-dpp";

export default async function createTransition(document: DocumentWASM, identityContractNonce: bigint, documentTypeName: string): Promise<DocumentCreateTransitionWASM> {
  return new this.wasm.DocumentCreateTransitionWASM(document, identityContractNonce, documentTypeName);
}