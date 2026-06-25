import {
  IdentityCreateFromShieldedPoolTransitionWASM,
  ShieldedBuilderWASM,
  ShieldedWithdrawalResultWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { IdentityCreateFromShieldedPoolParams, ShieldedTransitionParamsMap, ShieldedTransitionType } from '../../types.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

const shieldedTransitionsMap = {
  shield: {
    method: ShieldedBuilderWASM.prototype.shield,
    arguments: ['recipient', 'shieldAmount', 'inputs', 'privateKeys', 'feeStrategy', 'userFeeIncrease', 'memo'],
    optionalArguments: ['senderOvk']
  },
  shieldFromAssetLock: {
    method: ShieldedBuilderWASM.prototype.shieldFromAssetLock,
    arguments: ['recipient', 'shieldAmount', 'assetLockProof', 'privateKey', 'memo', 'dummyOutputs'],
    optionalArguments: ['senderOvk', 'surplusOutput']
  },
  shieldedWithdrawal: {
    method: ShieldedBuilderWASM.prototype.shieldedWithdrawal,
    arguments: ['spends', 'withdrawalAmount', 'outputScript', 'coreFeePerByte', 'pooling', 'changeAddress', 'seed', 'coinType', 'account', 'anchor', 'memo'],
    optionalArguments: []
  },
  unshield: {
    method: ShieldedBuilderWASM.prototype.unshield,
    arguments: ['spends', 'outputAddress', 'unshieldAmount', 'changeAddress', 'seed', 'coinType', 'account', 'anchor', 'memo'],
    optionalArguments: []
  },
  shieldedTransfer: {
    method: ShieldedBuilderWASM.prototype.shieldedTransfer,
    arguments: ['spends', 'recipient', 'transferAmount', 'changeAddress', 'seed', 'coinType', 'account', 'anchor', 'memo'],
    optionalArguments: []
  },
  identityCreateFromShieldedPool: {
    method: ShieldedBuilderWASM.prototype.identityCreateFromShieldedPool,
    arguments: ['publicKeys', 'privateKeys', 'denomination', 'sendToAddressOnCreationFailure', 'spends', 'changeAddress', 'seed', 'coinType', 'account', 'anchor', 'memo'],
    optionalArguments: []
  }
}

export default function createStateTransition<K extends ShieldedTransitionType> (
  builder: ShieldedBuilderWASM,
  type: K,
  params: ShieldedTransitionParamsMap[K]
): StateTransitionWASM {
  const { method: builderMethod, arguments: classArguments, optionalArguments } = shieldedTransitionsMap[type]

  if (builderMethod == null) {
    throw new Error(`Unimplemented shielded transition type: ${type}`)
  }

  const [missingArgument] = classArguments
    .filter((classArgument: string) => params[classArgument as keyof ShieldedTransitionParamsMap[K]] == null)

  if (missingArgument != null) {
    throw new Error(`Shielded transition param "${missingArgument}" is missing`)
  }

  const transitionParams = classArguments.concat(optionalArguments).map((classArgument: string) => params[classArgument as keyof ShieldedTransitionParamsMap[K]])

  const result = builderMethod.apply(builder, [...transitionParams, params.platformVersion ?? LATEST_PLATFORM_VERSION])

  if (result instanceof StateTransitionWASM) {
    return result
  }

  if (result instanceof ShieldedWithdrawalResultWASM) {
    return result.stateTransition
  }

  const { denomination, sendToAddressOnCreationFailure } = params as IdentityCreateFromShieldedPoolParams

  return new IdentityCreateFromShieldedPoolTransitionWASM(
    result.publicKeys,
    denomination,
    result.actions,
    result.anchor,
    result.proof,
    result.bindingsSignature,
    sendToAddressOnCreationFailure,
    result.identityId
  ).toStateTransition()
}