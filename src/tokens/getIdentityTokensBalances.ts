import GRPCConnectionPool from '../grpcConnectionPool'
import { IdentifierLike } from '../types'
import { IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import {
  GetIdentityTokenBalancesRequest,
  GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0
} from '../../proto/generated/platform'
import { verifyTokenBalancesForIdentityIdVec } from 'wasm-drive-verify'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export interface IdentityTokenBalances {
  tokenId: IdentifierWASM
  balance?: string | undefined
}

export default async function getIdentityTokensBalances (grpcPool: GRPCConnectionPool, identifier: IdentifierLike, tokenIdentifiers: IdentifierLike[]): Promise<IdentityTokenBalances[]> {
  const id = new IdentifierWASM(identifier)
  const tokenIds = tokenIdentifiers.map(tokenIdentifier => new IdentifierWASM(tokenIdentifier))

  const request = GetIdentityTokenBalancesRequest.fromPartial({
    v0: {
      tokenIds: tokenIds.map((identifier) => identifier.bytes()),
      identityId: id.bytes(),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentityTokenBalances(request)

  const { proof, metadata } = v0 as GetIdentityTokenBalancesResponse_GetIdentityTokenBalancesResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    balances
  } = verifyTokenBalancesForIdentityIdVec(
    proof.grovedbProof,
    tokenIds.map((identifier) => identifier.bytes()),
    id.bytes(),
    true,
    PlatformVersionWASM.PLATFORM_V9
  )

  const quorumPublicKey = await getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return balances
    .map((tokenBalance: { tokenId: Uint8Array, balance: bigint }) => ({
      tokenId: new IdentifierWASM(tokenBalance.tokenId),
      balance: tokenBalance.balance
    }))
}
