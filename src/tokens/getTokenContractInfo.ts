import { GRPCPool } from '../grpcConnectionPool.js'
import { GetTokenContractInfoRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyTokenContractInfoProof } from 'pshenmic-dpp'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export interface TokenContractInfo {
  dataContractId: IdentifierWASM
  tokenContractPosition: number
}

export default async function getTokenContractInfo (grpcPool: GRPCPool, tokenIdentifier: IdentifierLike): Promise<TokenContractInfo> {
  const tokenId = new IdentifierWASM(tokenIdentifier)

  const getTokenContractInfoRequest = GetTokenContractInfoRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        tokenId: (tokenId).bytes(),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getTokenContractInfo', getTokenContractInfoRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        contractInfo
      } = verifyGroveDBProof(
        verifyTokenContractInfoProof,
        proof.grovedbProof,
        tokenId,
        true,
        LATEST_PLATFORM_VERSION
      )

      if (contractInfo == null) {
        throw new Error('ContractInfo not found')
      }

      const result = {
        dataContractId: contractInfo.contractId,
        tokenContractPosition: contractInfo.tokenContractPosition
      }

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
