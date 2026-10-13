import { GRPCPool } from '../grpcConnectionPool.js'
import {
  PlatformAddressLike,
  PlatformAddressWASM,
  verifyPlatformAddressInfo
} from 'pshenmic-dpp'
import { GetAddressInfoRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import verifyProofSignature from '../utils/verifyProofSignature.js'
import { PlatformAddressInfo } from '../../types.js'

export async function getAddressInfo (grpcPool: GRPCPool, platformAddress: PlatformAddressLike): Promise<PlatformAddressInfo> {
  const platformAddressWASM = new PlatformAddressWASM(platformAddress)

  const getAddressInfoRequest = GetAddressInfoRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        address: platformAddressWASM.bytes(),
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

  const { rootHash, address, nonce, balance } = verifyPlatformAddressInfo(proof.grovedbProof, platformAddressWASM, true, LATEST_PLATFORM_VERSION)

  if (address == null || nonce == null || balance == null) {
    throw new Error(`Failed to fetch info for address ${platformAddressWASM.toBech32m(grpcPool.network)}`)
  }

  await verifyProofSignature(grpcPool, proof, metadata, rootHash)

  return {
    address,
    nonce,
    balance
  }
}
