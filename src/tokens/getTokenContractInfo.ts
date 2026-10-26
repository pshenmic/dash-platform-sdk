import { GRPCPool } from '../grpcConnectionPool.js'
import { GetTokenContractInfoRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyTokenContractInfoProof } from 'pshenmic-dpp'
import QueryExecutor from '../QueryExecutor.js'
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
    .setGrpcRequest('getTokenContractInfo', getTokenContractInfoRequest)
    .setProofVerifier(verifyTokenContractInfoProof, tokenId, true, LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      const contractInfo = data.proved ? data.verified.contractInfo : data.result.data

      if (contractInfo == null) {
        throw new Error('ContractInfo not found')
      }

      return {
        dataContractId: new IdentifierWASM(contractInfo.contractId),
        tokenContractPosition: contractInfo.tokenContractPosition
      }
    })
    .execute()
}
