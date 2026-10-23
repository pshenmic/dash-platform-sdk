import { GRPCPool } from '../grpcConnectionPool.js'
import { PlatformAddressLike, PlatformAddressWASM, verifyPlatformAddressesInfos } from 'pshenmic-dpp'
import { PlatformAddressInfo } from '../../types.js'
import { GetAddressesInfosRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'

export async function getAddressesInfos (grpcPool: GRPCPool, platformAddresses: PlatformAddressLike[]): Promise<PlatformAddressInfo[]> {
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

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('getAddressesInfos', getAddressInfoRequest)
    .addProof(response => {
      const { proof, metadata } = getResponseProof(response)

      const {
        rootHash,
        infos
      } = verifyGroveDBProof(verifyPlatformAddressesInfos, proof.grovedbProof, platformAddressesWASM, true, LATEST_PLATFORM_VERSION)

      const result = infos
        .map(info => ({
          address: info.address as PlatformAddressWASM,
          nonce: info.nonce ?? 0,
          balance: BigInt(info.balance ?? 0)
        }))

      return { result, rootHash, proof, metadata }
    })
    .execute()
}
