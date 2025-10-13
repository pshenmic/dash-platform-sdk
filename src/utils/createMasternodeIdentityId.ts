import { IdentifierWASM } from 'pshenmic-dpp'

export function createMasternodeIdentityId (proTxHash: string): IdentifierWASM {
  return IdentifierWASM.fromHex(proTxHash)
}
