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
   * Makes a query for platform address info, returns an object with address, balance and nonce
   *
   * @param address {PlatformAddressLike}
   * @return {Promise<PlatformAddressInfo>}
   */
  async getAddressInfo (address: PlatformAddressLike): Promise<PlatformAddressInfo> {
    return await getAddressInfo(this.grpcPool, address)
  }
}
