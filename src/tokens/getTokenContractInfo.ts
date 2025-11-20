import GRPCConnectionPool from '../grpcConnectionPool.js'
import { GetTokenContractInfoRequest } from '../../proto/generated/platform.js'
import { IdentifierLike } from '../types.js'
import { IdentifierWASM, verifyTokenContractInfoProof } from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import {LATEST_PLATFORM_VERSION} from "../constants.js";

export interface TokenContractInfo {
  dataContractId: IdentifierWASM
  tokenContractPosition: number
}

export default async function getTokenContractInfo (grpcPool: GRPCConnectionPool, tokenIdentifier: IdentifierLike): Promise<TokenContractInfo> {
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

  const { response } = await grpcPool.getClient().getTokenContractInfo(getTokenContractInfoRequest)

  const { version } = response

  if (version.oneofKind !== 'v0') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
  }

  const { v0 } = version

  if (v0.result.oneofKind !== 'proof') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be proof)')
  }

  const { result: { proof }, metadata } = v0

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    rootHash,
    contractInfo
  } = verifyTokenContractInfoProof(
    proof.grovedbProof,
    tokenId,
    true,
    LATEST_PLATFORM_VERSION
  )

  if (contractInfo == null) {
    throw new Error('ContractInfo not found')
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return {
    dataContractId: contractInfo.contractId,
    tokenContractPosition: contractInfo.tokenContractPosition
  }
}
