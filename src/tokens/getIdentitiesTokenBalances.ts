import GRPCConnectionPool from '../grpcConnectionPool'
import {
  GetIdentitiesTokenBalancesRequest,
  GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0
} from '../../proto/generated/platform'
import { IdentifierLike } from '../types'
import { IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { verifyTokenBalancesForIdentityIdsVec } from 'wasm-drive-verify'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export interface IdentitiesTokenBalances {
  identityId: IdentifierWASM
  balance?: string | undefined
}

export default async function getIdentitiesTokenBalances (grpcPool: GRPCConnectionPool, identifiers: IdentifierLike[], tokenIdentifier: IdentifierLike): Promise<IdentitiesTokenBalances[]> {
  const ids = identifiers.map(identifier => new IdentifierWASM(identifier))
  const tokenId = new IdentifierWASM(tokenIdentifier)

  const request = GetIdentitiesTokenBalancesRequest.fromPartial({
    v0: {
      tokenId: tokenId.bytes(),
      identityIds: ids.map(id => id.bytes()),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentitiesTokenBalances(request)

  const { proof, metadata } = v0 as GetIdentitiesTokenBalancesResponse_GetIdentitiesTokenBalancesResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    balances
  } = verifyTokenBalancesForIdentityIdsVec(
    proof.grovedbProof,
    tokenId.bytes(),
    true,
    ids.map(id => id.bytes()),
    PlatformVersionWASM.PLATFORM_V9
  )

  const quorumPublicKey = await getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return balances
    .map((identityTokenBalance: { identityId: Uint8Array, balance: bigint }) => ({
      identityId: new IdentifierWASM(identityTokenBalance.identityId),
      balance: identityTokenBalance.balance
    }))
}
