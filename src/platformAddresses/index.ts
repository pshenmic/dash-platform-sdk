import GRPCConnectionPool from '../grpcConnectionPool.js'
import {
  BlockAddressBalanceChanges,
  CompactedBlockAddressBalanceChanges,
  PlatformAddressLike,
  StateTransitionWASM,
  VerifiedAddressesBranchState
} from 'pshenmic-dpp'
import { getAddressInfo } from './getAddressInfo.js'
import {
  PlatformAddressesTrunkState,
  PlatformAddressInfo,
  PlatformAddressTransitionParamsMap,
  PlatformAddressTransitionType
} from '../../types.js'
import { getAddressesInfos } from './getAddressesInfos.js'
import { getAddressesTrunkState } from './getAddressesTrunkState.js'
import { getAddressesBranchState } from './getAddressesBranchState.js'
import { getRecentAddressBalanceChanges } from './getRecentAddressBalanceChanges.js'
import { getRecentCompactedAddressBalanceChanges } from './getRecentCompactedAddressBalanceChanges.js'
import createStateTransition from './createStateTransition.js'

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
   * Makes a query for the trunk chunk of the address funds tree, used as the entry point
   * for client-side sync of the address funds state
   *
   * Returns the verified trunk state (elements, leaf keys and helpers for descending into
   * branches) along with the response metadata, whose height is the checkpoint height for
   * subsequent branch queries
   *
   * @return {Promise<PlatformAddressesTrunkState>}
   */
  async getAddressesTrunkState (): Promise<PlatformAddressesTrunkState> {
    return await getAddressesTrunkState(this.grpcPool)
  }

  /**
   * Makes a query for a branch chunk of the address funds tree at the given key and depth,
   * anchored to the checkpoint height returned by the trunk state query
   *
   * The branch proof carries no root hash of its own - it is verified against
   * expectedRootHash, the hash the parent trunk (or branch) reported for this key
   * via its leaf info
   *
   * @param key {Uint8Array} key that was navigated to in the tree
   * @param depth {number} depth of the branch to return
   * @param checkpointHeight {bigint} block height from the trunk response metadata
   * @param expectedRootHash {Uint8Array} hash reported for this key by the parent trunk or branch
   * @return {Promise<VerifiedAddressesBranchState>}
   */
  async getAddressesBranchState (key: Uint8Array, depth: number, checkpointHeight: bigint, expectedRootHash: Uint8Array): Promise<VerifiedAddressesBranchState> {
    return await getAddressesBranchState(this.grpcPool, key, depth, checkpointHeight, expectedRootHash)
  }

  /**
   * Makes a query for recent address balance changes starting from the given block height,
   * returns an array of per-block change sets
   *
   * @param startHeight {bigint} block height to start from
   * @param startHeightExclusive {boolean} [startHeightExclusive=false] use exclusive start (RangeAfter) instead of inclusive (RangeFrom)
   * @return {Promise<BlockAddressBalanceChanges[]>}
   */
  async getRecentAddressBalanceChanges (startHeight: bigint, startHeightExclusive: boolean = false): Promise<BlockAddressBalanceChanges[]> {
    return await getRecentAddressBalanceChanges(this.grpcPool, startHeight, startHeightExclusive)
  }

  /**
   * Makes a query for recent compacted address balance changes starting from the given
   * block height, returns an array of compacted (block range) change sets
   *
   * @param startBlockHeight {bigint} block height to start from
   * @return {Promise<CompactedBlockAddressBalanceChanges[]>}
   */
  async getRecentCompactedAddressBalanceChanges (startBlockHeight: bigint): Promise<CompactedBlockAddressBalanceChanges[]> {
    return await getRecentCompactedAddressBalanceChanges(this.grpcPool, startBlockHeight)
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
   * @param params {PlatformAddressTransitionParamsMap[K]} params required by that transition type
   *
   * @return {StateTransitionWASM}
   */
  createStateTransition<K extends PlatformAddressTransitionType> (
    type: K,
    params: PlatformAddressTransitionParamsMap[K]
  ): StateTransitionWASM {
    return createStateTransition(type, params)
  }
}
