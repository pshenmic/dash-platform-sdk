import sha256 from './sha256'

export function calculateMsgHash (chainId: string, height: bigint, round: number, type: number, blockId: Uint8Array, stateId: Uint8Array): Uint8Array {
  const fixedSize = 4 + 8 + 8 + 32 + 32
  const chainIdBytes = new TextEncoder().encode(chainId)
  const totalSize = fixedSize + chainIdBytes.length
  
  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)
  const uint8View = new Uint8Array(buffer)

  let offset = 0

  // Write type as 32-bit little-endian integer
  view.setInt32(offset, type, true)
  offset += 4

  // Write height as 64-bit little-endian integer
  view.setBigUint64(offset, height, true)
  offset += 8

  // Write round as 64-bit little-endian integer
  view.setBigUint64(offset, BigInt(round), true)
  offset += 8

  // Copy blockId (32 bytes)
  uint8View.set(blockId, offset)
  offset += 32

  // Copy stateId (32 bytes)
  uint8View.set(stateId, offset)
  offset += 32

  if (offset !== fixedSize) {
    throw new Error('Invalid input length while encoding sign bytes')
  }

  // Copy chainId bytes
  uint8View.set(chainIdBytes, offset)

  return sha256(uint8View) as Uint8Array
}
