import { IdentifierWASM } from 'pshenmic-dpp'
import sha256 from './sha256.js'
import bytesToHex from './bytesToHex.js'
import hexToBytes from './hexToBytes.js'

export async function createVoterIdentityId (proTxHash: string, publicKeyHash: string): Promise<IdentifierWASM> {
  const proTxHashBytes = hexToBytes(proTxHash)
  const publicKeyHashBytes = hexToBytes(publicKeyHash)

  const mergedArray = new Uint8Array(proTxHashBytes.length + publicKeyHashBytes.length)

  mergedArray.set(proTxHashBytes)
  mergedArray.set(publicKeyHashBytes, proTxHashBytes.length)

  const voterIdentifierBytes = await sha256(mergedArray) as Uint8Array

  return IdentifierWASM.fromHex(bytesToHex(voterIdentifierBytes))
}
