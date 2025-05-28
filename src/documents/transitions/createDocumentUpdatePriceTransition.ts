import { DocumentUpdatePriceTransitionWASM, DocumentWASM } from 'pshenmic-dpp'

export default async function createDocumentUpdatePriceTransition (document: DocumentWASM, identityContractNonce: bigint, price: bigint): Promise<DocumentUpdatePriceTransitionWASM> {
  return new this.wasm.DocumentUpdatePriceTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), price)
}
