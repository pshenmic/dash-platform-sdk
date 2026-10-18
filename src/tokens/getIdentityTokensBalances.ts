import { GRPCPool } from '../grpcConnectionPool.js'
import { IdentifierLike, IdentifierWASM, verifyTokensBalancesForIdentityProof } from 'pshenmic-dpp'
import { GetIdentityTokenBalancesRequest } from '../../proto/generated/platform.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import withProofRetry from '../utils/withProofRetry.js'
import ProofError from '../utils/ProofError.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export interface IdentityTokenBalances {
  tokenId: IdentifierWASM
  balance?: bigint | undefined
}

export default async function getIdentityTokensBalances (grpcPool: GRPCPool, identifier: IdentifierLike, tokenIdentifiers: IdentifierLike[]): Promise<IdentityTokenBalances[]> {
  const id = new IdentifierWASM(identifier)
  const tokenIds = tokenIdentifiers.map(tokenIdentifier => new IdentifierWASM(tokenIdentifier))

  const getIdentityTokenBalancesRequest = GetIdentityTokenBalancesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        tokenIds: tokenIds.map((identifier) => identifier.bytes()),
        identityId: id.bytes(),
        prove: true
      }
    }
  })

  return await withProofRetry(grpcPool, async client => {
    const { response } = await client.getIdentityTokenBalances(getIdentityTokenBalancesRequest)

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
    } = verifyGroveDBProof(
      verifyTokensBalancesForIdentityProof,
      proof.grovedbProof,
      tokenIds,
      id,
      true,
      LATEST_PLATFORM_VERSION
    )

    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

    if (!verify) {
      throw new ProofError('Failed to verify query')
    }

    return balances
      .map(({ id, balance }) => ({
        tokenId: new IdentifierWASM(id),
        balance
      }))
  })
}
