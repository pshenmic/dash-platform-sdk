
import { bls12_381 } from '@noble/curves/bls12-381'

export default function verifyBls (publicKey: Uint8Array, msg: Uint8Array, signature: Uint8Array): boolean {
  try {
    const bls = bls12_381.longSignatures

    const msgp = bls.hash(msg)

    return bls.verify(signature, msgp, publicKey)
  } catch (e) {
    console.error('Error while verifying bls signature', e)

    return false
  }
}
