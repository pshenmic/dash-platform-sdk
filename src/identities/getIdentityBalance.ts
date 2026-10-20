import { GetIdentityBalanceRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyIdentityBalanceProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../utils/QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getIdentityBalance (grpcPool: GRPCPool, identifier: IdentifierLike): Promise<bigint> {
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

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest(client => client.getIdentityBalance(getIdentityBalanceRequest))
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        balance
      } = verifyGroveDBProof(verifyIdentityBalanceProof, proof.grovedbProof, id.bytes(), true, LATEST_PLATFORM_VERSION)

      if (balance == null) {
        throw new Error(`Failed to fetch balance for identifier ${id.base58()}`)
      }

      return { result: BigInt(balance), rootHash, proof, metadata }
    })
    .execute()
}
