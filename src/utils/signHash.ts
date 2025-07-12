import sha256 from './sha256'

export default function signHash (quorumType: number, quorumHash: Uint8Array, requestId: Uint8Array, signBytesHash: Uint8Array): Uint8Array {
  // Calculate total length: 1 byte for quorumType + 3 arrays of 32 bytes each
  const totalLength = 1 + quorumHash.length + requestId.length + signBytesHash.length
  const combined = new Uint8Array(totalLength)

  let offset = 0

  // Add quorumType as single byte
  combined[offset] = quorumType
  offset += 1

  // Add reversed quorumHash
  const reversedQuorumHash = new Uint8Array(quorumHash).reverse()
  combined.set(reversedQuorumHash, offset)
  offset += quorumHash.length

  // Add reversed requestId
  const reversedRequestId = new Uint8Array(requestId).reverse()
  combined.set(reversedRequestId, offset)
  offset += requestId.length

  // Add reversed signBytesHash
  const reversedSignBytesHash = new Uint8Array(signBytesHash).reverse()
  combined.set(reversedSignBytesHash, offset)

  return sha256(sha256(combined)) as Uint8Array
}
