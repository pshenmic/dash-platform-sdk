import {
  GetIdentityNonceRequest
} from '../../proto/generated/platform'
import parseIdentifier from '../utils/parseIdentifier'
import { IdentifierWASM } from 'pshenmic-dpp'

const IDENTITY_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityNonce (identifier: IdentifierWASM): Promise<bigint> {
  const getIdentityNonceRequest = GetIdentityNonceRequest.fromPartial({
    v0: {
      identityId: parseIdentifier(identifier)
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityNonce(getIdentityNonceRequest)

  const { identityNonce } = v0

  if (identityNonce == null) {
    throw new Error(`Could not get identityNonce for Identity with identifier ${identifier.base58()}`)
  }

  return BigInt(identityNonce) & IDENTITY_NONCE_VALUE_FILTER
}
