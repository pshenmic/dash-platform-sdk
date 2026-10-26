import { GetIdentityContractNonceRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyIdentityContractNonceProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import QueryExecutor from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

const IDENTITY_CONTRACT_NONCE_VALUE_FILTER = BigInt(0xFFFFFFFFFF)

export default async function getIdentityContractNonce (grpcPool: GRPCPool, identity: IdentifierLike, dataContract: IdentifierLike): Promise<bigint> {
  const identityIdentifier = new IdentifierWASM(identity)
  const dataContractIdentifier = new IdentifierWASM(dataContract)

  const getIdentityContractNonceRequest = GetIdentityContractNonceRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        identityId: identityIdentifier.bytes(),
        contractId: dataContractIdentifier.bytes(),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .setGrpcRequest('getIdentityContractNonce', getIdentityContractNonceRequest)
    .setProofVerifier(verifyIdentityContractNonceProof, identityIdentifier.bytes(), dataContractIdentifier.bytes(), true, LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      const contractNonce = data.proved ? data.verified.contractNonce : BigInt(data.result.identityContractNonce)

      return contractNonce != null ? contractNonce & IDENTITY_CONTRACT_NONCE_VALUE_FILTER : BigInt(0)
    })
    .execute()
}
