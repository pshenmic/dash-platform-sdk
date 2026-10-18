import { GRPCPool } from '../grpcConnectionPool.js'
import { GetIdentitiesTokenBalancesRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyTokenBalancesForIdentitiesProof } from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import withProofRetry from '../utils/withProofRetry.js'
import ProofError from '../utils/ProofError.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export interface IdentitiesTokenBalances {
  identityId: IdentifierWASM
  balance?: bigint | undefined
}

export default async function getIdentitiesTokenBalances (grpcPool: GRPCPool, identifiers: IdentifierLike[], tokenIdentifier: IdentifierLike): Promise<IdentitiesTokenBalances[]> {
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

  return await withProofRetry(grpcPool, async client => {
    const { response } = await client.getIdentitiesTokenBalances(getIdentitiesTokenBalancesRequest)

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
      verifyTokenBalancesForIdentitiesProof,
      proof.grovedbProof,
      tokenId,
      true,
      ids,
      LATEST_PLATFORM_VERSION
    )

    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

    if (!verify) {
      throw new ProofError('Failed to verify query')
    }

    return balances
      .map(({ id, balance }) => ({
        identityId: new IdentifierWASM(id),
        balance
      }))
  })
}
