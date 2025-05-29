import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'
import { createBatch } from './createBatch'
import { IdentifierLike } from '../../types'

export default async function (document: DocumentWASM, ownerId: IdentifierLike, identityContractNonce: bigint, price: bigint): Promise<StateTransitionWASM> {
  const transition = new this.wasm.DocumentPurchaseTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), price)

  return createBatch.bind(this)(transition, ownerId)
}
