export default function hexToBytes (hex): Uint8Array {
  return Uint8Array.from(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))
}
