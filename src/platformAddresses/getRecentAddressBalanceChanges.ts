import GRPCConnectionPool from '../grpcConnectionPool.js'
import { verifyRecentAddressBalanceChanges, BlockAddressBalanceChanges } from 'pshenmic-dpp'
import { GetRecentAddressBalanceChangesRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'

export async function getRecentAddressBalanceChanges (grpcPool: GRPCConnectionPool, startHeight: bigint, startHeightExclusive: boolean = false): Promise<BlockAddressBalanceChanges[]> {
  const getRecentAddressBalanceChangesRequest = GetRecentAddressBalanceChangesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        startHeight: startHeight.toString(),
        prove: true,
        startHeightExclusive
      }
    }
  })

  const { response } = await grpcPool.getClient().getRecentAddressBalanceChanges(getRecentAddressBalanceChangesRequest)

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

  const { rootHash, blocks } = verifyRecentAddressBalanceChanges(proof.grovedbProof, startHeight, startHeightExclusive, undefined, true, LATEST_PLATFORM_VERSION)

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return blocks
}
