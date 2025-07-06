import {
  GetIdentityByPublicKeyHashRequest, GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0
} from '../../proto/generated/platform'
import { IdentityWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool'
import hexToBytes from "../utils/hexToBytes";

export default async function getIdentityByPublicKeyHash (grpcPool: GRPCConnectionPool, hex: string): Promise<IdentityWASM> {
  const getIdentityByPublicKeyHashRequest = GetIdentityByPublicKeyHashRequest.fromPartial({
    v0: {
      publicKeyHash: hexToBytes(hex)
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentityByPublicKeyHash(getIdentityByPublicKeyHashRequest)

  const { identity } = v0 as GetIdentityByPublicKeyHashResponse_GetIdentityByPublicKeyHashResponseV0

  if (identity == null) {
    throw new Error(`Identity with public key hash ${hex} not found`)
  }

  return IdentityWASM.fromBytes(identity)
}
