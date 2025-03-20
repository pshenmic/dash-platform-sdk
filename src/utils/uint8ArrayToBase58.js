import { base58 } from '@scure/base'

export default function uint8ArrayToBase58 (uint8Array) {
  return base58.encode(uint8Array)
}
