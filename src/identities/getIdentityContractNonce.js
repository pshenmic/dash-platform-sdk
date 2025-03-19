import {
  GetIdentityContractNonceRequest
} from '../../proto/generated/platform'
import parseIdentifier from '../utils/parseIdentifier'

const IDENTITY_CONTRACT_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityContractNonce (identity, dataContract) {
  // eslint-disable-next-line new-cap
  const getIdentityContractNonceRequest = new GetIdentityContractNonceRequest.fromPartial({
    v0: {
      identityId: parseIdentifier(identity),
      contractId: parseIdentifier(dataContract)
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityContractNonce(getIdentityContractNonceRequest)

  const { identityContractNonce } = v0

  if (!identityContractNonce) {
    throw new Error(`Could not get identityContractNonce for Identity with identifier ${identity}`)
  }

  return BigInt(identityContractNonce) & IDENTITY_CONTRACT_NONCE_VALUE_FILTER
}
