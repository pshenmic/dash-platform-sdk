import { GRPCPool } from '../grpcConnectionPool.js'
import { GetTokenContractInfoRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyTokenContractInfoProof } from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import withProofRetry from '../utils/withProofRetry.js'
import ProofError from '../utils/ProofError.js'
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

  return await withProofRetry(grpcPool, async client => {
    const { response } = await client.getTokenContractInfo(getTokenContractInfoRequest)

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

    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

    if (!verify) {
      throw new ProofError('Failed to verify query')
    }

    return {
      dataContractId: contractInfo.contractId,
      tokenContractPosition: contractInfo.tokenContractPosition
    }
  })
}
