import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'
import { createBatch } from './createBatch'

export default async function (document: DocumentWASM, identityContractNonce: bigint): Promise<StateTransitionWASM> {
  const transition = new this.wasm.DocumentDeleteTransitionWASM(document, identityContractNonce, document.getDocumentTypeName())

  return createBatch.bind(this)(transition, document.getOwnerId())
}
