import { base64 } from '@scure/base'
import { ConsensusErrorWASM } from 'pshenmic-dpp'

export function deserializeConsensusError (error: string | Uint8Array): string {
  let normError: Uint8Array<ArrayBufferLike>

  if (typeof error === 'string') {
    // @scure/base64 works only with padded base64, but cbor can return unpadded base64
    const padding = error.length % 4
    if (padding !== 0) {
      error += '='.repeat(4 - padding)
    }

    normError = base64.decode(error)
  } else {
    normError = error
  }

  return ConsensusErrorWASM.deserialize(normError).message
}
