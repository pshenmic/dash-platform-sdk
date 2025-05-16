import {
  GetIdentityContractNonceRequest
} from '../../proto/generated/platform'
import parseIdentifier from '../utils/parseIdentifier'
import {DataContractWASM, IdentifierWASM, IdentityWASM} from 'pshenmic-dpp'

const IDENTITY_CONTRACT_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityContractNonce (identity: IdentifierLike, dataContract: IdentifierLike): Promise<bigint> {
  const identityIdentifier = new IdentifierWASM(identity)
  const dataContractIdentifier = new IdentifierWASM(dataContract)

  const getIdentityContractNonceRequest = GetIdentityContractNonceRequest.fromPartial({
    v0: {
      identityId: identityIdentifier.bytes(),
      contractId: dataContractIdentifier.bytes()
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityContractNonce(getIdentityContractNonceRequest)

  const { identityContractNonce } = v0

  if (identityContractNonce == null) {
    throw new Error(`Could not get identityContractNonce for Identity with identifier ${identityIdentifier.base58()}`)
  }

  return BigInt(identityContractNonce) & IDENTITY_CONTRACT_NONCE_VALUE_FILTER
}
