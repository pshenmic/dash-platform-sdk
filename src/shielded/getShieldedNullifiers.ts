import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedNullifiersRequest } from '../../proto/generated/platform.js'
import { ShieldedNullifierStatus } from '../../types.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedNullifiersProof } from 'pshenmic-dpp'
import {LATEST_PLATFORM_VERSION} from "../constants.js";
import {getQuorumPublicKey} from "../utils/getQuorumPublicKey.js";
import bytesToHex from "../utils/bytesToHex.js";
import verifyTenderdashProof from "../utils/verifyTenderdashProof.js";
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import withProofRetry from '../utils/withProofRetry.js'
import ProofError from '../utils/ProofError.js'

export default async function getShieldedNullifiers (
  grpcPool: GRPCPool,
  nullifiers: Uint8Array[],
  tokenIdentifier?: IdentifierLike
): Promise<ShieldedNullifierStatus[]> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedNullifiersRequest = GetShieldedNullifiersRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        nullifiers,
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await withProofRetry(grpcPool, async client => {
    const { response } = await client.getShieldedNullifiers(getShieldedNullifiersRequest)

    const { version } = response

    if (version.oneofKind !== 'v0') {
      throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
    }

    const { v0 } = version

    if (v0.result.oneofKind !== 'proof') {
      throw new Error('Unexpected oneOf type returned from DAPI (must be proof)')
    }

    const {result: {proof}, metadata} = v0

    if(metadata == null) {
      throw new Error('Metadata not found')
    }

    const {rootHash, nullifiers: nullifiersStatuses} = verifyGroveDBProof(verifyShieldedNullifiersProof, proof.grovedbProof, nullifiers, true, LATEST_PLATFORM_VERSION, tokenId)

    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

    if (!verify) {
      throw new ProofError('Failed to verify query')
    }

    return nullifiersStatuses.map(entry => ({
      nullifier: entry.nullifier,
      isSpent: entry.isSpent
    }))
  })
}
