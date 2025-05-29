import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'
import { createBatch } from './createBatch'
import { IdentifierLike } from '../../types'

export default async function (document: DocumentWASM, identityContractNonce: bigint, recipient: IdentifierLike): Promise<StateTransitionWASM> {
  const transition = new this.wasm.DocumentTransferTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), recipient)

  return createBatch.bind(this)(transition, document.getOwnerId())
}
