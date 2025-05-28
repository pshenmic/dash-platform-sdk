import { DocumentTransferTransitionWASM, DocumentWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../../types'

export default async function createDocumentTransferTransition (document: DocumentWASM, identityContractNonce: bigint, recipient: IdentifierLike): Promise<DocumentTransferTransitionWASM> {
  return new this.wasm.DocumentTransferTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), recipient)
}
