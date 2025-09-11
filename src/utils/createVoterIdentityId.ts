import { sha256 as sha256Func } from 'hash.js'
import hexToBytes from './hexToBytes'
import { IdentifierWASM } from 'pshenmic-dpp'

export function createVoterIdentityId (proTxHash: string, publicKeyHash: string): IdentifierWASM {
  const hash = sha256Func().update(hexToBytes(proTxHash))

  hash.update(hexToBytes(publicKeyHash))

  const voterHex = hash.digest('hex')

  return IdentifierWASM.fromHex(voterHex)
}
