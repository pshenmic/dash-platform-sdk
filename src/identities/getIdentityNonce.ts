import {
  GetIdentityNonceRequest
} from '../../proto/generated/platform'
import { IdentifierWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'

const IDENTITY_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityNonce (identifier: IdentifierLike): Promise<bigint> {
  const identityIdentifier = new IdentifierWASM(identifier)
  const getIdentityNonceRequest = GetIdentityNonceRequest.fromPartial({
    v0: {
      identityId: identityIdentifier.bytes()
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityNonce(getIdentityNonceRequest)

  const { identityNonce } = v0

  if (identityNonce == null) {
    throw new Error(`Could not get identityNonce for Identity with identifier ${identityIdentifier.base58()}`)
  }

  return BigInt(identityNonce) & IDENTITY_NONCE_VALUE_FILTER
}
