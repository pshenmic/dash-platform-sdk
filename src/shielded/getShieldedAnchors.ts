import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedAnchorsRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedAnchorsProof } from 'pshenmic-dpp'
import {LATEST_PLATFORM_VERSION} from "../constants.js";
import {getQuorumPublicKey} from "../utils/getQuorumPublicKey.js";
import bytesToHex from "../utils/bytesToHex.js";
import verifyTenderdashProof from "../utils/verifyTenderdashProof.js";
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import withProofRetry from '../utils/withProofRetry.js'
import ProofError from '../utils/ProofError.js'

export default async function getShieldedAnchors (
  grpcPool: GRPCPool,
  tokenIdentifier?: IdentifierLike
): Promise<Uint8Array[]> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedAnchorsRequest = GetShieldedAnchorsRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await withProofRetry(grpcPool, async client => {
    const { response } = await client.getShieldedAnchors(getShieldedAnchorsRequest)

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

    const {rootHash, anchors} = verifyGroveDBProof(verifyShieldedAnchorsProof, proof.grovedbProof, true, LATEST_PLATFORM_VERSION, tokenId)

    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

    if (!verify) {
      throw new ProofError('Failed to verify query')
    }

    return anchors
  })
}
