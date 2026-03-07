import GRPCConnectionPool from '../grpcConnectionPool.js'
import { PlatformAddressLike, VerifiedPlatformAddressInfo } from 'pshenmic-dpp'
import { getAddressInfo } from './getAddressInfo.js'

export class PlatformAddressesController {
  /** @ignore **/
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  /**
   * Make a query for address info
   *
   * @param address {string | Uint8Array | PlatformAddressWASM}
   * @return {
   *   address?: PlatformAddressWASM,
   *   nonce?: number,
   *   balance?: bigint
   * }
   */
  async getAddressInfo (address: PlatformAddressLike): Promise<VerifiedPlatformAddressInfo> {
    return await getAddressInfo(this.grpcPool, address)
  }
}
