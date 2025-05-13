import { base58 } from '@scure/base'

export default function base58ToUint8Array (str: string): Uint8Array {
  return base58.decode(str)
}
