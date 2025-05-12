import { base58 } from '@scure/base'

export default function parseIdentifier (identifier): Uint8Array {
  return base58.decode(identifier)
}
