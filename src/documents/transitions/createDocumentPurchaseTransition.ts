import { DocumentPurchaseTransitionWASM, DocumentWASM } from 'pshenmic-dpp'

export default async function createDocumentPurchaseTransition (document: DocumentWASM, identityContractNonce: bigint, price: bigint): Promise<DocumentPurchaseTransitionWASM> {
  return new this.wasm.DocumentPurchaseTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), price)
}
