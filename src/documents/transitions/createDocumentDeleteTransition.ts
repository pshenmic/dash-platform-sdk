import { DocumentDeleteTransitionWASM, DocumentWASM } from 'pshenmic-dpp'

export default async function createDocumentDeleteTransition (document: DocumentWASM, identityContractNonce: bigint): Promise<DocumentDeleteTransitionWASM> {
  return new this.wasm.DocumentDeleteTransitionWASM(document, identityContractNonce, document.getDocumentTypeName())
}
