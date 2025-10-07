import GRPCConnectionPool from '../grpcConnectionPool'
import { GetTokenTotalSupplyRequest } from '../../proto/generated/platform'
import { IdentifierLike, TokenTotalSupply } from '../types'
import { IdentifierWASM, PlatformVersionWASM, verifyTokenTotalSupplyProof } from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export default async function getTokenTotalSupply (grpcPool: GRPCConnectionPool, tokenIdentifier: IdentifierLike): Promise<TokenTotalSupply> {
  const tokenId = new IdentifierWASM(tokenIdentifier)

  const getTokenTotalSupplyRequest = GetTokenTotalSupplyRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        tokenId: (tokenId).bytes(),
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getTokenTotalSupply(getTokenTotalSupplyRequest)

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
    totalBalance
  } = verifyTokenTotalSupplyProof(
    proof.grovedbProof,
    tokenId,
    true,
    PlatformVersionWASM.PLATFORM_V9
  )

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return {
    tokenId,
    totalSystemAmount: totalBalance.tokenSupply,
    totalAggregatedAmountInUserAccounts: totalBalance.aggregatedTokenAccountBalances
  }
}
