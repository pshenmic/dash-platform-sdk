export default function hexToBytes (hex: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from((hex.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16)))
}
