import GRPCConnectionPool from '../grpcConnectionPool.js'
import {
  PlatformAddressLike,
  PlatformAddressWASM,
  verifyPlatformAddressInfo
} from 'pshenmic-dpp'
import { GetAddressInfoRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import { PlatformAddressInfo } from '../../types.js'

export async function getAddressInfo (grpcPool: GRPCConnectionPool, platformAddress: PlatformAddressLike): Promise<PlatformAddressInfo> {
  const normalPlatformAddress = new PlatformAddressWASM(platformAddress)

  const getAddressInfoRequest = GetAddressInfoRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        address: normalPlatformAddress.bytes(),
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getAddressInfo(getAddressInfoRequest)

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

  const { rootHash, address, nonce, balance } = await verifyPlatformAddressInfo(proof.grovedbProof, normalPlatformAddress, true, LATEST_PLATFORM_VERSION)

  if (address == null || nonce == null || balance == null) {
    throw new Error(`Failed to fetch info for address ${normalPlatformAddress.toBech32m(grpcPool.network)}`)
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return {
    address,
    nonce,
    balance
  }
}
