import {
  DocumentsBatchWASM,
  DocumentTransitionWASM,
  DocumentWASM
} from 'pshenmic-dpp'
import { DocumentTransitionLike, IdentifierLike } from '../../types'
import ArrayLike = jasmine.ArrayLike

function convertToTransition (
  input: DocumentWASM | DocumentTransitionWASM | DocumentTransitionLike,
  identityContractNonce?: bigint | null): DocumentTransitionWASM {
  if (input instanceof DocumentTransitionWASM) {
    return input
  } else if (input instanceof DocumentWASM) {
    if (identityContractNonce == null) {
      throw new Error('You must specify a documentTypeName and identityContractNonce in opts if use DocumentWASM as inputs')
    }

    const normalTransition = new this.wasm.DocumentCreateTransitionWASM(input, identityContractNonce, input.getDocumentTypeName())

    return normalTransition.toDocumentTransition()
  } else {
    return input.toDocumentTransition()
  }
}

export async function createBatch (
  inputs: DocumentWASM | DocumentTransitionWASM | DocumentTransitionLike | DocumentWASM[] | DocumentTransitionWASM[] | DocumentTransitionLike[],
  ownerId: IdentifierLike,
  opts?: {
    identityContractNonce?: bigint | null
    userFeeIncrease?: number | null
    signaturePublicKeyId?: number | null
    signature?: ArrayLike<number> | null
  }
): Promise<DocumentsBatchWASM> {
  let transitions: DocumentTransitionWASM[] = []

  if (inputs instanceof Array) {
    transitions = inputs.map(
      (input: DocumentWASM | DocumentTransitionWASM | DocumentTransitionLike): DocumentTransitionWASM =>
        convertToTransition(input, opts?.identityContractNonce)
    )
  } else {
    transitions = [convertToTransition(inputs, opts?.identityContractNonce)]
  }

  const signature: Uint8Array | undefined = opts?.signature != null ? Uint8Array.from(opts?.signature) : undefined

  return new this.wasm.DocumentsBatchWASM(transitions, ownerId, opts?.userFeeIncrease, opts?.signaturePublicKeyId, signature)
}
