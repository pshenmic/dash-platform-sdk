import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedPoolStateRequest } from '../../proto/generated/platform.js'
import verifyProofSignature from "../utils/verifyProofSignature.js";
import {verifyShieldedPoolStateProof} from "pshenmic-dpp";
import {LATEST_PLATFORM_VERSION} from "../constants.js";

export default async function getShieldedPoolState (
  grpcPool: GRPCPool
): Promise<bigint | undefined> {
  const getShieldedPoolStateRequest = GetShieldedPoolStateRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getShieldedPoolState(getShieldedPoolStateRequest)

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

  const {rootHash, totalBalance} = verifyShieldedPoolStateProof(proof.grovedbProof, true, LATEST_PLATFORM_VERSION)

  await verifyProofSignature(grpcPool, proof, metadata, rootHash)

  return totalBalance
}
