export function typedArrayToBuffer (bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteLength + bytes.byteOffset) as ArrayBuffer
}
