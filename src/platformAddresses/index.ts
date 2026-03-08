import GRPCConnectionPool from '../grpcConnectionPool.js'
import { PlatformAddressLike } from 'pshenmic-dpp'
import { getAddressInfo } from './getAddressInfo.js'
import {PlatformAddressInfo} from "../../types.js";

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
  async getAddressInfo (address: PlatformAddressLike): Promise<PlatformAddressInfo> {
    return await getAddressInfo(this.grpcPool, address)
  }
}
