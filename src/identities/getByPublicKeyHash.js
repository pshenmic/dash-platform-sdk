import {
  GetIdentityByPublicKeyHashRequest,
} from '../../proto/generated/platform'
import { IdentityWASM } from 'pshenmic-dpp'
import hexToUint8Array from '../utils/hexToUint8Array'

export default async function getByPublicKeyHash (hex) {
  const getIdentityByPublicKeyHashRequest = new GetIdentityByPublicKeyHashRequest.fromPartial({
    v0: {
      publicKeyHash: hexToUint8Array(hex),
    }
  })

  const { v0 } = await this.client.getIdentityByPublicKeyHash(getIdentityByPublicKeyHashRequest)

  const { identity } = v0

  if (!identity) {
    throw new Error(`Identity with public key hash ${hex} not found`)
  }

  return IdentityWASM.fromBytes(identity)
}
