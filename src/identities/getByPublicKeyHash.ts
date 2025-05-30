import {
  GetIdentityByPublicKeyHashRequest
} from '../../proto/generated/platform'
import { IdentityWASM } from 'pshenmic-dpp'
import hexToBytes from '../utils/hexToBytes'

export default async function getByPublicKeyHash (hex: string): Promise<IdentityWASM> {
  const getIdentityByPublicKeyHashRequest = GetIdentityByPublicKeyHashRequest.fromPartial({
    v0: {
      publicKeyHash: hexToBytes(hex)
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityByPublicKeyHash(getIdentityByPublicKeyHashRequest)

  const { identity } = v0

  if (identity == null) {
    throw new Error(`Identity with public key hash ${hex} not found`)
  }

  return IdentityWASM.fromBytes(identity)
}
