import GRPCConnectionPool from '../grpcConnectionPool'
import {
  GetTokenContractInfoRequest,
  GetTokenContractInfoResponse_GetTokenContractInfoResponseV0
} from '../../proto/generated/platform'
import { IdentifierLike } from '../types'
import { IdentifierWASM } from 'pshenmic-dpp'

export interface TokenContractInfo {
  contractId: IdentifierWASM
  tokenContractPosition: number
}

export default async function getTokenContractInfo (grpcPool: GRPCConnectionPool, tokenIdentifier: IdentifierLike): Promise<TokenContractInfo> {
  const tokenId = new IdentifierWASM(tokenIdentifier)

  const request = GetTokenContractInfoRequest.fromPartial({
    v0: {
      tokenId: (tokenId).bytes()
    }
  })

  const { v0 } = await grpcPool.getClient().getTokenContractInfo(request)

  const { data } = v0 as GetTokenContractInfoResponse_GetTokenContractInfoResponseV0

  if (data == null) {
    throw new Error(`Token with identifier ${tokenId.base58()} not found`)
  }

  return {
    contractId: new IdentifierWASM(data.contractId),
    tokenContractPosition: data.tokenContractPosition
  }
}
