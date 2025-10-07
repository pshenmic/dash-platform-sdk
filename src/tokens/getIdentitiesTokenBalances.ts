import GRPCConnectionPool from '../grpcConnectionPool'
import { GetIdentitiesTokenBalancesRequest } from '../../proto/generated/platform'
import { IdentifierLike } from '../types'
import { IdentifierWASM, PlatformVersionWASM, verifyTokenBalancesForIdentitiesProof } from 'pshenmic-dpp'
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

  const getIdentitiesTokenBalancesRequest = GetIdentitiesTokenBalancesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        tokenId: tokenId.bytes(),
        identityIds: ids.map(id => id.bytes()),
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getIdentitiesTokenBalances(getIdentitiesTokenBalancesRequest)

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
    balances
  } = verifyTokenBalancesForIdentitiesProof(
    proof.grovedbProof,
    tokenId,
    true,
    ids,
    PlatformVersionWASM.PLATFORM_V9
  )

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return balances
    .map((identityTokenBalance: { identityId: Uint8Array, balance: bigint }) => ({
      identityId: new IdentifierWASM(identityTokenBalance.identityId),
      balance: identityTokenBalance.balance
    }))
}
