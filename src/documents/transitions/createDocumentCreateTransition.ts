import { DocumentCreateTransitionWASM, DocumentWASM } from 'pshenmic-dpp'

export default async function createDocumentCreateTransition (document: DocumentWASM, identityContractNonce: bigint): Promise<DocumentCreateTransitionWASM> {
  return new this.wasm.DocumentCreateTransitionWASM(document, identityContractNonce, document.getDocumentTypeName())
}
