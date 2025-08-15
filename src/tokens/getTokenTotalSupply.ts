import GRPCConnectionPool from '../grpcConnectionPool'
import {
  GetTokenTotalSupplyRequest,
  GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0
} from '../../proto/generated/platform'
import { IdentifierLike } from '../types'
import { IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { verifyTokenTotalSupplyAndAggregatedIdentityBalance } from 'wasm-drive-verify'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export interface TokenTotalSupply {
  tokenId: IdentifierWASM
  totalSystemAmount: string
  totalAggregatedAmountInUserAccounts: string
}

export default async function getTokenTotalSupply (grpcPool: GRPCConnectionPool, tokenIdentifier: IdentifierLike): Promise<TokenTotalSupply> {
  const tokenId = new IdentifierWASM(tokenIdentifier)

  const request = GetTokenTotalSupplyRequest.fromPartial({
    v0: {
      tokenId: (tokenId).bytes(),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getTokenTotalSupply(request)

  const { proof, metadata } = v0 as GetTokenTotalSupplyResponse_GetTokenTotalSupplyResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    total_supply_and_balance: totalSupplyAndBalance
  } = verifyTokenTotalSupplyAndAggregatedIdentityBalance(
    proof.grovedbProof,
    tokenId.bytes(),
    true,
    PlatformVersionWASM.PLATFORM_V9
  )

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return {
    tokenId: new IdentifierWASM(totalSupplyAndBalance.tokenId),
    totalSystemAmount: totalSupplyAndBalance.totalSystemAmount,
    totalAggregatedAmountInUserAccounts: totalSupplyAndBalance.totalAggregatedAmountInUserAccounts
  }
}
