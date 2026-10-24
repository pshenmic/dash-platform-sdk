import { GetIdentityBalanceRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyIdentityBalanceProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import QueryExecutor from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getIdentityBalance (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, identifier: IdentifierLike): Promise<bigint> {
  const id = new IdentifierWASM(identifier)

  const getIdentityBalanceRequest = GetIdentityBalanceRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        id: id.bytes(),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .addGrpcRequest('getIdentityBalance', getIdentityBalanceRequest)
    .addProofVerifier(verifyIdentityBalanceProof, id.bytes(), true, LATEST_PLATFORM_VERSION)
    .addMapper(data => {
      const balance = data.proved ? data.verified.balance : BigInt(data.result.balance)

      if (balance == null) {
        throw new Error(`Failed to fetch balance for identifier ${id.base58()}`)
      }

      return balance
    })
    .execute()
}
