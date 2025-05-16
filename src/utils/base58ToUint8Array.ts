import { base58 } from '@scure/base'

export default function stringToBase58 (string: string): Uint8Array {
  return base58.decode(string)
}
