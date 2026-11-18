import {
  IdentityCreateFromShieldedPoolTransitionWASM,
  ShieldedBuilderWASM,
  ShieldedWithdrawalResultWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { IdentityCreateFromShieldedPoolParams, ShieldedTransitionParamsMap, ShieldedTransitionType } from '../../types.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

// Arguments the builder takes by position and accepts as undefined. They sit in the
// middle of the token signatures, so an omitted one is passed through as undefined
// instead of being left off the end of the call.
const NULLABLE_ARGUMENTS = new Set(['senderOvk', 'publicNote', 'usingGroupInfo', 'claimUpTo'])

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
  shieldedTransferMulti: {
    method: ShieldedBuilderWASM.prototype.shieldedTransferMulti,
    arguments: ['spends', 'outputs', 'changeAddress', 'seed', 'coinType', 'account', 'anchor'],
    optionalArguments: []
  },
  identityCreateFromShieldedPool: {
    method: ShieldedBuilderWASM.prototype.identityCreateFromShieldedPool,
    arguments: ['publicKeys', 'privateKeys', 'denomination', 'sendToAddressOnCreationFailure', 'spends', 'changeAddress', 'seed', 'coinType', 'account', 'anchor', 'memo'],
    optionalArguments: []
  },
  tokenShield: {
    method: ShieldedBuilderWASM.prototype.tokenShield,
    arguments: ['tokenId', 'ownerId', 'dataContractId', 'tokenContractPosition', 'recipient', 'amount', 'memo', 'senderOvk', 'identityPublicKey', 'privateKey', 'identityContractNonce', 'userFeeIncrease'],
    optionalArguments: []
  },
  tokenUnshield: {
    method: ShieldedBuilderWASM.prototype.tokenUnshield,
    arguments: ['tokenId', 'ownerId', 'dataContractId', 'tokenContractPosition', 'spends', 'recipientId', 'amount', 'changeAddress', 'seed', 'coinType', 'account', 'anchor', 'memo', 'identityPublicKey', 'privateKey', 'identityContractNonce', 'userFeeIncrease'],
    optionalArguments: []
  },
  tokenShieldedTransfer: {
    method: ShieldedBuilderWASM.prototype.tokenShieldedTransfer,
    arguments: ['tokenId', 'ownerId', 'dataContractId', 'tokenContractPosition', 'spends', 'recipient', 'transferAmount', 'changeAddress', 'seed', 'coinType', 'account', 'anchor', 'memo', 'identityPublicKey', 'privateKey', 'identityContractNonce', 'userFeeIncrease'],
    optionalArguments: []
  },
  tokenMintToPool: {
    method: ShieldedBuilderWASM.prototype.tokenMintToPool,
    arguments: ['tokenId', 'ownerId', 'dataContractId', 'tokenContractPosition', 'recipient', 'amount', 'memo', 'senderOvk', 'publicNote', 'usingGroupInfo', 'identityPublicKey', 'privateKey', 'identityContractNonce', 'userFeeIncrease'],
    optionalArguments: []
  },
  tokenBurnFromPool: {
    method: ShieldedBuilderWASM.prototype.tokenBurnFromPool,
    arguments: ['tokenId', 'ownerId', 'dataContractId', 'tokenContractPosition', 'spends', 'amount', 'changeAddress', 'seed', 'coinType', 'account', 'anchor', 'memo', 'publicNote', 'usingGroupInfo', 'identityPublicKey', 'privateKey', 'identityContractNonce', 'userFeeIncrease'],
    optionalArguments: []
  },
  tokenClaimToPool: {
    method: ShieldedBuilderWASM.prototype.tokenClaimToPool,
    arguments: ['tokenId', 'ownerId', 'dataContractId', 'tokenContractPosition', 'recipient', 'amount', 'distributionType', 'claimUpTo', 'memo', 'senderOvk', 'publicNote', 'identityPublicKey', 'privateKey', 'identityContractNonce', 'userFeeIncrease'],
    optionalArguments: []
  },
  tokenDirectPurchaseToPool: {
    method: ShieldedBuilderWASM.prototype.tokenDirectPurchaseToPool,
    arguments: ['tokenId', 'ownerId', 'dataContractId', 'tokenContractPosition', 'recipient', 'tokenCount', 'totalAgreedPrice', 'memo', 'senderOvk', 'identityPublicKey', 'privateKey', 'identityContractNonce', 'userFeeIncrease'],
    optionalArguments: []
  },
  tokenShieldedTransferWithShieldedFee: {
    method: ShieldedBuilderWASM.prototype.tokenShieldedTransferWithShieldedFee,
    arguments: ['tokenId', 'dataContractId', 'tokenContractPosition', 'tokenSpends', 'tokenChangeAddress', 'tokenAnchor', 'recipient', 'transferAmount', 'feeSpends', 'feeChangeAddress', 'feeAnchor', 'seed', 'coinType', 'account', 'memo'],
    optionalArguments: []
  },
  tokenUnshieldWithShieldedFee: {
    method: ShieldedBuilderWASM.prototype.tokenUnshieldWithShieldedFee,
    arguments: ['tokenId', 'dataContractId', 'tokenContractPosition', 'tokenSpends', 'tokenChangeAddress', 'tokenAnchor', 'recipientId', 'amount', 'feeSpends', 'feeChangeAddress', 'feeAnchor', 'seed', 'coinType', 'account', 'memo'],
    optionalArguments: []
  },
  tokenPurchaseFromShieldedPool: {
    method: ShieldedBuilderWASM.prototype.tokenPurchaseFromShieldedPool,
    arguments: ['tokenId', 'dataContractId', 'tokenContractPosition', 'recipient', 'tokenCount', 'totalAgreedPrice', 'feeSpends', 'feeChangeAddress', 'feeAnchor', 'seed', 'coinType', 'account', 'memo'],
    optionalArguments: []
  }
}

export default async function createStateTransition<K extends ShieldedTransitionType> (
  builder: ShieldedBuilderWASM,
  type: K,
  params: ShieldedTransitionParamsMap[K]
): Promise<StateTransitionWASM> {
  const { method: builderMethod, arguments: classArguments, optionalArguments } = shieldedTransitionsMap[type]

  if (builderMethod == null) {
    throw new Error(`Unimplemented shielded transition type: ${type}`)
  }

  const [missingArgument] = classArguments
    .filter((classArgument: string) => !NULLABLE_ARGUMENTS.has(classArgument))
    .filter((classArgument: string) => params[classArgument as keyof ShieldedTransitionParamsMap[K]] == null)

  if (missingArgument != null) {
    throw new Error(`Shielded transition param "${missingArgument}" is missing`)
  }

  const transitionParams = classArguments.concat(optionalArguments).map((classArgument: string) => params[classArgument as keyof ShieldedTransitionParamsMap[K]])

  const result = await builderMethod.apply(builder, [...transitionParams, params.platformVersion ?? LATEST_PLATFORM_VERSION])

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
