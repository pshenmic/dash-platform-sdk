import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { PlatformAddressLike, PlatformAddressWASM, verifyPlatformAddressesInfos } from 'pshenmic-dpp'
import { PlatformAddressInfo } from '../../types.js'
import { GetAddressesInfosRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'

export async function getAddressesInfos (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, platformAddresses: PlatformAddressLike[]): Promise<PlatformAddressInfo[]> {
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

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('getAddressesInfos', getAddressInfoRequest)
    .setProofVerifier(verifyPlatformAddressesInfos, platformAddressesWASM, true, LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      const infos = data.proved
        ? data.verified.infos
        : data.result.addressInfoEntries.addressInfoEntries
          .map(({ address, balanceAndNonce }) => ({ address: PlatformAddressWASM.fromBytes(address), ...balanceAndNonce }))

      return infos
        .map(info => ({
          address: info.address as PlatformAddressWASM,
          nonce: info.nonce ?? 0,
          balance: BigInt(info.balance ?? 0)
        }))
    })
    .execute()
}
