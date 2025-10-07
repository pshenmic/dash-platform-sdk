import bytesToHex from './bytesToHex'
import { typedArrayToBuffer } from './bytesToTypedArray'

export default async function sha256 (input: Uint8Array | string): Promise<Uint8Array | string> {
  if (typeof input === 'string') {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hash = await crypto.subtle.digest('SHA-256', data)

    return bytesToHex(new Uint8Array(hash))
  } else {
    const arrayBuffer: ArrayBuffer = typedArrayToBuffer(input)
    const hash = await crypto.subtle.digest('SHA-256', arrayBuffer)

    return new Uint8Array(hash)
  }
}
