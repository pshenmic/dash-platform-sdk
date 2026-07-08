import {
  IdentityCreditTransferToAddressesTransitionWASM,
  IdentityCreateFromAddressesTransitionWASM,
  IdentityTopUpFromAddressesTransitionWASM,
  AddressFundsTransferTransitionWASM,
  AddressFundingFromAssetLockTransitionWASM,
  AddressCreditWithdrawalTransitionWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { PlatformAddressTransitionParamsMap, PlatformAddressTransitionType } from '../../types.js'

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
 * @param params {PlatformAddressTransitionParamsMap[K]} params required by that transition type
 */
export default function createStateTransition<K extends PlatformAddressTransitionType> (
  type: K,
  params: PlatformAddressTransitionParamsMap[K]
): StateTransitionWASM {
  const { class: TransitionClass, arguments: classArguments, optionalArguments } = platformAddressTransitionsMap[type] ?? {}

  if (TransitionClass == null) {
    throw new Error(`Unimplemented transition type: ${type}`)
  }

  const [missingArgument] = classArguments
    .filter((classArgument: string) => params[classArgument as keyof PlatformAddressTransitionParamsMap[K]] == null &&
          !optionalArguments.includes(classArgument))

  if (missingArgument != null) {
    throw new Error(`Platform address transition param "${missingArgument}" is missing`)
  }

  // userFeeIncrease is a required positional `number` in every WASM constructor,
  // so coerce a missing value to 0 to keep the positional order intact.
  const transitionParams = classArguments.map((classArgument: string) =>
    classArgument === 'userFeeIncrease'
      ? (params[classArgument as keyof PlatformAddressTransitionParamsMap[K]] ?? 0)
      : params[classArgument as keyof PlatformAddressTransitionParamsMap[K]])

  // @ts-expect-error
  const platformAddressTransition = new TransitionClass(...transitionParams)

  return platformAddressTransition.toStateTransition()
}
