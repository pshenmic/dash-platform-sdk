import GRPCConnectionPool from '../grpcConnectionPool'
import {
  GetTokenContractInfoRequest,
  GetTokenContractInfoResponse_GetTokenContractInfoResponseV0
} from '../../proto/generated/platform'
import { IdentifierLike } from '../types'
import { IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { verifyTokenContractInfo } from 'wasm-drive-verify'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export interface TokenContractInfo {
  contractId: IdentifierWASM
  tokenContractPosition: number
}

export default async function getTokenContractInfo (grpcPool: GRPCConnectionPool, tokenIdentifier: IdentifierLike): Promise<TokenContractInfo> {
  const tokenId = new IdentifierWASM(tokenIdentifier)

  const request = GetTokenContractInfoRequest.fromPartial({
    v0: {
      tokenId: (tokenId).bytes(),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getTokenContractInfo(request)

  const { proof, metadata } = v0 as GetTokenContractInfoResponse_GetTokenContractInfoResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    contract_info: contractInfo
  } = verifyTokenContractInfo(
    proof.grovedbProof,
    tokenId.bytes(),
    true,
    PlatformVersionWASM.PLATFORM_V9
  )

  const quorumPublicKey = await getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  if (contractInfo == null) {
    throw new Error('ContractInfo not found')
  }

  return {
    contractId: new IdentifierWASM(contractInfo.contractId),
    tokenContractPosition: contractInfo.tokenContractPosition
  }
}
