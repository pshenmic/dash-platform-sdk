import GRPCConnectionPool from '../grpcConnectionPool.js'
import { PlatformAddressLike } from 'pshenmic-dpp'
import { getAddressInfo } from './getAddressInfo.js'
import { PlatformAddressInfo } from '../../types.js'

export class PlatformAddressesController {
  /** @ignore **/
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  /**
   * Make a query for address info
   *
   * @param address {PlatformAddressLike}
   * @return {Promise<PlatformAddressInfo>}
   */
  async getAddressInfo (address: PlatformAddressLike): Promise<PlatformAddressInfo> {
    return await getAddressInfo(this.grpcPool, address)
  }
}
