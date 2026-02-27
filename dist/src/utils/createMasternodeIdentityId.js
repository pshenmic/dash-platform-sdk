import { IdentifierWASM } from 'pshenmic-dpp';
export function createMasternodeIdentityId(proTxHash) {
    return IdentifierWASM.fromHex(proTxHash);
}
