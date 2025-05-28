import { DocumentReplaceTransitionWASM, DocumentWASM } from 'pshenmic-dpp'

export default async function createDocumentReplaceTransition (document: DocumentWASM, identityContractNonce: BigInt): Promise<DocumentReplaceTransitionWASM> {
  return new this.wasm.DocumentReplaceTransitionWASM(document, identityContractNonce, document.getDocumentTypeName())
}
