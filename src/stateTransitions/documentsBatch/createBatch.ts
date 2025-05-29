import {
  DocumentTransitionWASM,
  DocumentWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { DocumentTransitionLike, IdentifierLike } from '../../types'

function convertToTransition (
  input: DocumentWASM | DocumentTransitionWASM | DocumentTransitionLike,
  identityContractNonce?: bigint | null): DocumentTransitionWASM {
  if (input instanceof DocumentTransitionWASM) {
    return input
  } else if (input instanceof DocumentWASM) {
    if (identityContractNonce == null) {
      throw new Error('You must specify identityContractNonce in opts if use DocumentWASM as inputs')
    }

    const normalTransition = new this.wasm.DocumentCreateTransitionWASM(input, identityContractNonce, input.getDocumentTypeName())

    return normalTransition.toDocumentTransition()
  } else {
    return input.toDocumentTransition()
  }
}

export async function createBatch (
  inputs: DocumentWASM | DocumentTransitionWASM | DocumentTransitionLike,
  ownerId: IdentifierLike,
  opts?: {
    identityContractNonce?: bigint | null
    userFeeIncrease?: number | null
    signaturePublicKeyId?: number | null
    signature?: Uint8Array | null
  }
): Promise<StateTransitionWASM> {
  let transitions: DocumentTransitionWASM[]

  transitions = [convertToTransition.bind(this)(inputs, opts?.identityContractNonce)]

  const signature: Uint8Array | undefined = opts?.signature != null ? opts?.signature : undefined

  const batch = new this.wasm.DocumentsBatchWASM(transitions, ownerId, opts?.userFeeIncrease, opts?.signaturePublicKeyId, signature)

  return batch.toStateTransition()
}
