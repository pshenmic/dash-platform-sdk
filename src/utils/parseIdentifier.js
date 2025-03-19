import { base58 } from '@scure/base'

export default function parseIdentifier (identifier) {
  if (typeof identifier === 'string') {
    return base58.decode(identifier)
  }
}
