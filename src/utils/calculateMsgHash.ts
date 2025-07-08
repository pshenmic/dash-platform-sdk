import sha256 from './sha256'

export function calculateMsgHash (chainId: string, height: bigint, round: number, type: number, blockId: Uint8Array, stateId: Uint8Array): Uint8Array {
  const fixedSize = 4 + 8 + 8 + 32 + 32
  const buf = Buffer.alloc(fixedSize + Buffer.byteLength(chainId))

  let offset = 0

  buf.writeInt32LE(type, offset)
  offset += 4

  buf.writeBigInt64LE(height, offset)
  offset += 8

  buf.writeBigInt64LE(BigInt(round), offset)
  offset += 8

  Buffer.from(blockId).copy(buf, offset)
  offset += 32

  Buffer.from(stateId).copy(buf, offset)
  offset += 32

  if (offset !== fixedSize) {
    throw new Error('Invalid input length while encoding sign bytes')
  }

  buf.write(chainId, offset, 'utf8')

  return sha256(buf) as Uint8Array
}
