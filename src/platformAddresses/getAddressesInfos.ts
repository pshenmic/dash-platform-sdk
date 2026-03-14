import GRPCConnectionPool from '../grpcConnectionPool.js'
import { PlatformAddressLike, PlatformAddressWASM, verifyPlatformAddressesInfos } from 'pshenmic-dpp'
import { PlatformAddressInfo } from '../../types.js'
import { GetAddressesInfosRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'

export async function getAddressesInfos (grpcPool: GRPCConnectionPool, platformAddresses: PlatformAddressLike[]): Promise<PlatformAddressInfo[]> {
  const platformAddressesWASM = platformAddresses.map(addr => new PlatformAddressWASM(addr))

  const getAddressInfoRequest = GetAddressesInfosRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        addresses: platformAddressesWASM.map(addr => addr.bytes()),
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getAddressesInfos(getAddressInfoRequest)

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
    infos
  } = verifyPlatformAddressesInfos(proof.grovedbProof, platformAddressesWASM, true, LATEST_PLATFORM_VERSION)

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return infos
    .map(info => ({
      address: info.address as PlatformAddressWASM,
      nonce: info.nonce ?? 0,
      balance: BigInt(info.balance ?? 0)
    }))
}
