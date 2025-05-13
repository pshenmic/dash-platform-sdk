import {
  GetIdentityContractNonceRequest
} from '../../proto/generated/platform'
import parseIdentifier from '../utils/parseIdentifier'
import { DataContractWASM, IdentityWASM } from 'pshenmic-dpp'

const IDENTITY_CONTRACT_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityContractNonce (identity: IdentityWASM, dataContract: DataContractWASM): Promise<bigint> {
  const getIdentityContractNonceRequest = GetIdentityContractNonceRequest.fromPartial({
    v0: {
      identityId: parseIdentifier(identity),
      contractId: parseIdentifier(dataContract)
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityContractNonce(getIdentityContractNonceRequest)

  const { identityContractNonce } = v0

  if (identityContractNonce == null) {
    throw new Error(`Could not get identityContractNonce for Identity with identifier ${identity.getId().base58()}`)
  }

  return BigInt(identityContractNonce) & IDENTITY_CONTRACT_NONCE_VALUE_FILTER
}
