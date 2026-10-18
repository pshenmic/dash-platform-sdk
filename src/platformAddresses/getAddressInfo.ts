import { GRPCPool } from '../grpcConnectionPool.js'
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
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import withProofRetry from '../utils/withProofRetry.js'
import ProofError from '../utils/ProofError.js'
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

  return await withProofRetry(grpcPool, async client => {
    const { response } = await client.getAddressInfo(getAddressInfoRequest)

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

    const { rootHash, address, nonce, balance } = verifyGroveDBProof(verifyPlatformAddressInfo, proof.grovedbProof, platformAddressWASM, true, LATEST_PLATFORM_VERSION)

    if (address == null || nonce == null || balance == null) {
      throw new Error(`Failed to fetch info for address ${platformAddressWASM.toBech32m(grpcPool.network)}`)
    }

    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

    if (!verify) {
      throw new ProofError('Failed to verify query')
    }

    return {
      address,
      nonce,
      balance
    }
  })
}
