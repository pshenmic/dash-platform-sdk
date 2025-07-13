export default function stringToIndexValueBytes (name: string): Uint8Array {
  const lengthBuffer = new Uint8Array(1)
  lengthBuffer[0] = name.length

  const nameBuffer = new TextEncoder().encode(name)
  const result = new Uint8Array(1 + 1 + nameBuffer.length)

  result[0] = 0x12
  result[1] = lengthBuffer[0]
  result.set(nameBuffer, 2)

  return result
}
