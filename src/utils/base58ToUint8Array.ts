import { base58 } from '@scure/base'

export default function stringToBase58 (string) {
  return base58.decode(string)
}
