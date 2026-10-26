import { GRPCPool } from '../grpcConnectionPool.js'
import {
  PlatformAddressLike,
  PlatformAddressWASM,
  verifyPlatformAddressInfo
} from 'pshenmic-dpp'
import { GetAddressInfoRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'
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
    .setGrpcRequest('getAddressInfo', getAddressInfoRequest)
    .setProofVerifier(verifyPlatformAddressInfo, platformAddressWASM, true, LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      const balanceAndNonce = data.proved ? data.verified : data.result.addressInfoEntry.balanceAndNonce

      if (balanceAndNonce?.nonce == null || balanceAndNonce.balance == null) {
        throw new Error(`Failed to fetch info for address ${platformAddressWASM.toBech32m(grpcPool.network)}`)
      }

      return {
        address: platformAddressWASM,
        nonce: balanceAndNonce.nonce,
        balance: BigInt(balanceAndNonce.balance)
      }
    })
    .execute()
}
