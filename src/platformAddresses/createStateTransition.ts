import {
  IdentityCreditTransferToAddressesTransitionWASM,
  IdentityCreateFromAddressesTransitionWASM,
  IdentityTopUpFromAddressesTransitionWASM,
  AddressFundsTransferTransitionWASM,
  AddressFundingFromAssetLockTransitionWASM,
  AddressCreditWithdrawalTransitionWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { PlatformAddressTransitionParams } from '../../types.js'

export type PlatformAddressTransitionType =
  'identityCreditTransferToAddresses' |
  'identityCreateFromAddresses' |
  'identityTopUpFromAddresses' |
  'addressFundsTransfer' |
  'addressFundingFromAssetLock' |
  'addressCreditWithdrawal'

const platformAddressTransitionsMap = {
  identityCreditTransferToAddresses: {
    class: IdentityCreditTransferToAddressesTransitionWASM,
    arguments: ['identityId', 'recipients', 'nonce', 'userFeeIncrease'],
    optionalArguments: ['userFeeIncrease']
  },
  identityCreateFromAddresses: {
    class: IdentityCreateFromAddressesTransitionWASM,
    arguments: ['publicKeys', 'inputs', 'feeStrategy', 'userFeeIncrease', 'inputWitness', 'output'],
    optionalArguments: ['userFeeIncrease', 'output']
  },
  identityTopUpFromAddresses: {
    class: IdentityTopUpFromAddressesTransitionWASM,
    arguments: ['identityId', 'inputs', 'feeStrategy', 'userFeeIncrease', 'inputWitness', 'output'],
    optionalArguments: ['userFeeIncrease', 'output']
  },
  addressFundsTransfer: {
    class: AddressFundsTransferTransitionWASM,
    arguments: ['inputs', 'feeStrategy', 'userFeeIncrease', 'inputWitness', 'outputs'],
    optionalArguments: ['userFeeIncrease']
  },
  addressFundingFromAssetLock: {
    class: AddressFundingFromAssetLockTransitionWASM,
    arguments: ['assetLockProof', 'inputs', 'feeStrategy', 'userFeeIncrease', 'inputWitness', 'outputs'],
    optionalArguments: ['userFeeIncrease']
  },
  addressCreditWithdrawal: {
    class: AddressCreditWithdrawalTransitionWASM,
    arguments: ['inputs', 'feeStrategy', 'coreFeePerByte', 'pooling', 'outputScript', 'userFeeIncrease', 'inputWitness', 'output'],
    optionalArguments: ['userFeeIncrease', 'output']
  }
}

/**
 * Helper function that assembles a {StateTransitionWASM} for Platform Address transitions
 * out of already-built params. The builder is pure: it does not sign, broadcast or
 * mutate the passed params. Producing witnesses / signatures stays the caller's
 * responsibility (they are passed in via the `inputWitness` / `signature` params).
 *
 * @param type {string} type of transition
 * @param params {PlatformAddressTransitionParams} params
 */
export default function createStateTransition (type: PlatformAddressTransitionType, params: PlatformAddressTransitionParams): StateTransitionWASM {
  const { class: TransitionClass, arguments: classArguments, optionalArguments } = platformAddressTransitionsMap[type] ?? {}

  if (TransitionClass == null) {
    throw new Error(`Unimplemented transition type: ${type}`)
  }

  const [missingArgument] = classArguments
    .filter((classArgument: string) => params[classArgument] == null &&
          !(optionalArguments).includes(classArgument))

  if (missingArgument != null) {
    throw new Error(`Platform address transition param "${missingArgument}" is missing`)
  }

  // userFeeIncrease is a required positional `number` in every WASM constructor,
  // so coerce a missing value to 0 to keep the positional order intact.
  const transitionParams = classArguments.map((classArgument: string) =>
    classArgument === 'userFeeIncrease' ? (params[classArgument] ?? 0) : params[classArgument])

  // @ts-expect-error
  const platformAddressTransition = new TransitionClass(...transitionParams)

  return platformAddressTransition.toStateTransition()
}
