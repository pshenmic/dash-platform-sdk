import GRPCConnectionPool from '../grpcConnectionPool.js'
import { verifyRecentCompactedAddressBalanceChanges, CompactedBlockAddressBalanceChanges } from 'pshenmic-dpp'
import { GetRecentCompactedAddressBalanceChangesRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'

export async function getRecentCompactedAddressBalanceChanges (grpcPool: GRPCConnectionPool, startBlockHeight: bigint): Promise<CompactedBlockAddressBalanceChanges[]> {
  const getRecentCompactedAddressBalanceChangesRequest = GetRecentCompactedAddressBalanceChangesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        startBlockHeight: startBlockHeight.toString(),
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getRecentCompactedAddressBalanceChanges(getRecentCompactedAddressBalanceChangesRequest)

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

  const { rootHash, ranges } = verifyRecentCompactedAddressBalanceChanges(proof.grovedbProof, startBlockHeight, undefined, LATEST_PLATFORM_VERSION)

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return ranges
}
