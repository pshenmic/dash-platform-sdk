import sha256 from './sha256'

export default function signRequestId (prefix: string, height: bigint, round: number): Uint8Array {
  const prefixBytes = new TextEncoder().encode(prefix)

  // len + i64 + i32 (prefix length + 8 bytes for height + 4 bytes for round)
  const totalLength = prefixBytes.length + 8 + 4
  const buffer = new ArrayBuffer(totalLength)
  const view = new DataView(buffer)
  const uint8View = new Uint8Array(buffer)

  let offset = 0

  // Copy prefix bytes
  uint8View.set(prefixBytes, offset)
  offset += prefixBytes.length

  // Write height as 64-bit little-endian integer
  view.setBigUint64(offset, height, true)
  offset += 8

  // Write round as 32-bit little-endian integer
  view.setInt32(offset, round, true)

  return sha256(uint8View) as Uint8Array
}
