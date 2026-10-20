import { GRPCPool } from '../grpcConnectionPool.js'
import {
  PlatformAddressLike,
  PlatformAddressWASM,
  verifyPlatformAddressInfo
} from 'pshenmic-dpp'
import { GetAddressInfoRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../utils/QueryExecutor.js'
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

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest(client => client.getAddressInfo(getAddressInfoRequest))
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const { rootHash, address, nonce, balance } = verifyGroveDBProof(verifyPlatformAddressInfo, proof.grovedbProof, platformAddressWASM, true, LATEST_PLATFORM_VERSION)

      if (address == null || nonce == null || balance == null) {
        throw new Error(`Failed to fetch info for address ${platformAddressWASM.toBech32m(grpcPool.network)}`)
      }

      const result = {
        address,
        nonce,
        balance
      }

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
