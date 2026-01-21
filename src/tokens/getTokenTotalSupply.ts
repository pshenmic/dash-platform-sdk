import GRPCConnectionPool from '../grpcConnectionPool.js'
import { GetTokenTotalSupplyRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, TokenTotalSupply } from '../../types.js'
import { IdentifierWASM, verifyTokenTotalSupplyProof } from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

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
    LATEST_PLATFORM_VERSION
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
