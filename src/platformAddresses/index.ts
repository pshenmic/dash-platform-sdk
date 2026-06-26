import GRPCConnectionPool from '../grpcConnectionPool.js'
import { PlatformAddressLike, StateTransitionWASM } from 'pshenmic-dpp'
import { getAddressInfo } from './getAddressInfo.js'
import { PlatformAddressInfo, PlatformAddressTransitionParams } from '../../types.js'
import { getAddressesInfos } from './getAddressesInfos.js'
import createStateTransition, { PlatformAddressTransitionType } from './createStateTransition.js'

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

  /**
   * Makes a query for platform addresses infos, returns array with an object with address, balance and nonce
   *
   * @param addresses {PlatformAddressLike[]}
   * @return {Promise<PlatformAddressInfo[]>}
   */
  async getAddressesInfos (addresses: PlatformAddressLike[]): Promise<PlatformAddressInfo[]> {
    return await getAddressesInfos(this.grpcPool, addresses)
  }

  /**
   * Helper function for creating {StateTransitionWASM} for Platform Address transitions
   *
   * Unlike identity transitions (which are signed after construction), address transitions carry
   * their signature material as constructor input (the `inputWitness` param, and a `signature`
   * setter on the asset-lock variant), so this builder is pure and only assembles the transition
   * from already-built params - producing witnesses stays the caller's responsibility.
   *
   * Please refer to PlatformAddress.spec.ts or README for example commands
   *
   * @param type {string} type of transition, must be a one of ('identityCreditTransferToAddresses' |
   * 'identityCreateFromAddresses' | 'identityTopUpFromAddresses' | 'addressFundsTransfer' |
   * 'addressFundingFromAssetLock' | 'addressCreditWithdrawal')
   * @param params {PlatformAddressTransitionParams} params
   *
   * @return {StateTransitionWASM}
   */
  createStateTransition (type: PlatformAddressTransitionType, params: PlatformAddressTransitionParams): StateTransitionWASM {
    return createStateTransition(type, params)
  }
}
