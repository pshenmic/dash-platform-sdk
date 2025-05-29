import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'
import { createBatch } from './createBatch'

export default async function (document: DocumentWASM, identityContractNonce: bigint, price: bigint): Promise<StateTransitionWASM> {
  const transition = new this.wasm.DocumentUpdatePriceTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), price)

  return createBatch.bind(this)(transition, document.getOwnerId())
}
