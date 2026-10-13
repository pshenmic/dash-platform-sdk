import { GRPCPool } from '../grpcConnectionPool.js'
import { GetMostRecentShieldedAnchorRequest } from '../../proto/generated/platform.js'
import {verifyMostRecentShieldedAnchorProof} from "pshenmic-dpp";
import {LATEST_PLATFORM_VERSION} from "../constants.js";
import verifyProofSignature from "../utils/verifyProofSignature.js";

export default async function getMostRecentShieldedAnchor (
  grpcPool: GRPCPool
): Promise<Uint8Array | undefined> {
  const getMostRecentShieldedAnchorRequest = GetMostRecentShieldedAnchorRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getMostRecentShieldedAnchor(getMostRecentShieldedAnchorRequest)

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

  const {rootHash, anchor} = verifyMostRecentShieldedAnchorProof(proof.grovedbProof, true, LATEST_PLATFORM_VERSION)

  await verifyProofSignature(grpcPool, proof, metadata, rootHash)

  return anchor
}
