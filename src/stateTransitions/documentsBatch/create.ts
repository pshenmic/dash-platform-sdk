import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'
import { createBatch } from './createBatch'

export default async function (document: DocumentWASM, identityContractNonce: bigint): Promise<StateTransitionWASM> {
  return createBatch.bind(this)(document, document.getOwnerId(), { identityContractNonce })
}
