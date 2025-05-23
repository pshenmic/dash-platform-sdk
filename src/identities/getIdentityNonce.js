import {
  GetIdentityNonceRequest
} from '../../proto/generated/platform'
import parseIdentifier from '../utils/parseIdentifier'

const IDENTITY_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityNonce (identifier) {
  // eslint-disable-next-line new-cap
  const getIdentityNonceRequest = new GetIdentityNonceRequest.fromPartial({
    v0: {
      identityId: parseIdentifier(identifier)
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityNonce(getIdentityNonceRequest)

  const { identityNonce } = v0

  if (!identityNonce) {
    throw new Error(`Could not get identityNonce for Identity with identifier ${identifier}`)
  }

  return BigInt(identityNonce) & IDENTITY_NONCE_VALUE_FILTER
}
