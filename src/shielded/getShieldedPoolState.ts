import GRPCConnectionPool from '../grpcConnectionPool.js'
import { GetShieldedPoolStateRequest } from '../../proto/generated/platform.js'
import {getQuorumPublicKey} from "../utils/getQuorumPublicKey.js";
import bytesToHex from "../utils/bytesToHex.js";
import verifyTenderdashProof from "../utils/verifyTenderdashProof.js";
import {verifyShieldedPoolStateProof} from "pshenmic-dpp";
import {LATEST_PLATFORM_VERSION} from "../constants.js";

export default async function getShieldedPoolState (
  grpcPool: GRPCConnectionPool
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

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return totalBalance
}
