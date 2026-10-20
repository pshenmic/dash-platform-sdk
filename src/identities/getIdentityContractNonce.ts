import { GetIdentityContractNonceRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyIdentityContractNonceProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../utils/QueryExecutor.js'
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
    .addGrpcRequest(client => client.getIdentityContractNonce(getIdentityContractNonceRequest))
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        contractNonce
      } = verifyGroveDBProof(verifyIdentityContractNonceProof, proof.grovedbProof, identityIdentifier.bytes(), dataContractIdentifier.bytes(), true, LATEST_PLATFORM_VERSION)

      const result = contractNonce != null ? BigInt(contractNonce) & IDENTITY_CONTRACT_NONCE_VALUE_FILTER : BigInt(0)

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
