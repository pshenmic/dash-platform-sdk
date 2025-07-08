import { sha256 as sha256Func } from 'hash.js'

export default function sha256 (input: Uint8Array | string): Uint8Array | string {
  const hash = sha256Func().update(input)

  if (typeof input === 'string') {
    return hash.digest('hex')
  } else {
    return Uint8Array.from(hash.digest())
  }
}
