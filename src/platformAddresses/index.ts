import GRPCConnectionPool from '../grpcConnectionPool.js'
import { CoreScriptWASM, OutputAddressWASM, PlatformAddressLike, StateTransitionWASM } from 'pshenmic-dpp'
import { base58 } from '@scure/base'
import { getAddressInfo } from './getAddressInfo.js'
import {
  AddressFundingFromAssetLockParams,
  AddressFundsTransferParams,
  IdentityCreateFromAddressesParams,
  IdentityTopUpFromAddressesParams,
  PlatformAddressInfo,
  PlatformAddressTransitionParamsMap,
  PlatformAddressTransitionType,
  TransferToAddressParams,
  WithdrawalToCoreParams
} from '../../types.js'
import { getAddressesInfos } from './getAddressesInfos.js'
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

  /**
   * Transfer credits from an Identity to one or more Platform addresses (transition type 9).
   *
   * Pass either a single `recipient` + `amount`, or explicit `recipients` outputs. This transition
   * is signed by the Identity key after construction (no `inputWitness` required).
   *
   * @param params {TransferToAddressParams} params
   *
   * @return {StateTransitionWASM}
   */
  transferToAddress (params: TransferToAddressParams): StateTransitionWASM {
    const recipients = params.recipients ?? (params.recipient != null && params.amount != null
      ? [new OutputAddressWASM(params.recipient, params.amount)]
      : undefined)

    return createStateTransition('identityCreditTransferToAddresses', {
      identityId: params.identityId,
      // @ts-expect-error recipients may be undefined here; the builder's missing-param check reports it
      recipients,
      nonce: params.nonce,
      userFeeIncrease: params.userFeeIncrease
    })
  }

  /**
   * Create a new Identity funded from Platform addresses (transition type 10).
   *
   * @param params {IdentityCreateFromAddressesParams} params
   *
   * @return {StateTransitionWASM}
   */
  createIdentityFromAddresses (params: IdentityCreateFromAddressesParams): StateTransitionWASM {
    return createStateTransition('identityCreateFromAddresses', params)
  }

  /**
   * Top up an existing Identity from Platform addresses (transition type 11).
   *
   * @param params {IdentityTopUpFromAddressesParams} params
   *
   * @return {StateTransitionWASM}
   */
  topUpFromAddresses (params: IdentityTopUpFromAddressesParams): StateTransitionWASM {
    return createStateTransition('identityTopUpFromAddresses', params)
  }

  /**
   * Transfer credits between Platform addresses (transition type 12).
   *
   * @param params {AddressFundsTransferParams} params
   *
   * @return {StateTransitionWASM}
   */
  transferBetweenAddresses (params: AddressFundsTransferParams): StateTransitionWASM {
    return createStateTransition('addressFundsTransfer', params)
  }

  /**
   * Fund Platform addresses from a Core asset lock (transition type 13).
   *
   * @param params {AddressFundingFromAssetLockParams} params
   *
   * @return {StateTransitionWASM}
   */
  fundFromAssetLock (params: AddressFundingFromAssetLockParams): StateTransitionWASM {
    return createStateTransition('addressFundingFromAssetLock', params)
  }

  /**
   * Withdraw from Platform addresses to a Core (L1) address (transition type 14).
   *
   * Pass either a `coreAddress` (converted to a P2PKH output script) or an explicit `outputScript`.
   * `coreFeePerByte` defaults to 1 and `pooling` to 'Standard', mirroring the Identity withdrawal.
   *
   * @param params {WithdrawalToCoreParams} params
   *
   * @return {StateTransitionWASM}
   */
  withdrawalToCore (params: WithdrawalToCoreParams): StateTransitionWASM {
    const outputScript = params.outputScript ?? (params.coreAddress != null
      ? CoreScriptWASM.newP2PKH(base58.decode(params.coreAddress).slice(1, 21))
      : undefined)

    return createStateTransition('addressCreditWithdrawal', {
      inputs: params.inputs,
      feeStrategy: params.feeStrategy,
      coreFeePerByte: params.coreFeePerByte ?? 1,
      pooling: params.pooling ?? 'Standard',
      // @ts-expect-error outputScript may be undefined here; the builder's missing-param check reports it
      outputScript,
      inputWitness: params.inputWitness,
      output: params.output,
      userFeeIncrease: params.userFeeIncrease
    })
  }
}
