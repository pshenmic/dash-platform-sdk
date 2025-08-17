import {
  BatchedTransitionWASM,
  BatchTransitionWASM,
  IdentifierWASM,
  StateTransitionWASM,
  TokenBaseTransitionWASM,
  TokenBurnTransitionWASM,
  TokenDestroyFrozenFundsTransitionWASM,
  TokenDirectPurchaseTransitionWASM,
  TokenEmergencyActionTransitionWASM,
  TokenFreezeTransitionWASM,
  TokenMintTransitionWASM,
  TokenSetPriceForDirectPurchaseTransitionWASM,
  TokenTransferTransitionWASM, TokenTransitionWASM,
  TokenUnFreezeTransitionWASM
} from 'pshenmic-dpp'
import { TokenTransitionParams, TokenTransitionType } from '../types'

const tokenTransitionsMap = {
  burn: {
    class: TokenBurnTransitionWASM,
    arguments: ['amount', 'publicNote'],
    optionalArguments: ['publicNote']
  },
  mint: {
    class: TokenMintTransitionWASM,
    arguments: ['identityId', 'amount', 'publicNote'],
    optionalArguments: ['publicNote']
  },
  transfer: {
    class: TokenTransferTransitionWASM,
    arguments: ['identityId', 'amount', 'publicNote', 'sharedEncryptedNote', 'privateEncryptedNote'],
    optionalArguments: ['publicNote', 'sharedEncryptedNote', 'privateEncryptedNote']
  },
  freeze: {
    class: TokenFreezeTransitionWASM,
    arguments: ['identityId', 'publicNote'],
    optionalArguments: ['publicNote']
  },
  unfreeze: {
    class: TokenUnFreezeTransitionWASM,
    arguments: ['identityId', 'publicNote'],
    optionalArguments: ['publicNote']
  },
  destroyFrozenFunds: {
    class: TokenDestroyFrozenFundsTransitionWASM,
    arguments: ['identityId', 'publicNote'],
    optionalArguments: ['publicNote']
  },
  emergencyAction: {
    class: TokenEmergencyActionTransitionWASM,
    arguments: ['emergencyAction', 'publicNote'],
    optionalArguments: ['publicNote']
  },
  directPurchase: {
    class: TokenDirectPurchaseTransitionWASM,
    arguments: ['tokenCount', 'totalAgreedPrice'],
    optionalArguments: []
  },
  setPriceForDirectPurchase: {
    class: TokenSetPriceForDirectPurchaseTransitionWASM,
    arguments: ['price', 'publicNote'],
    optionalArguments: ['publicNote']
  }
}

export default function createStateTransition (base: TokenBaseTransitionWASM, ownerId: IdentifierWASM, type: TokenTransitionType, params: TokenTransitionParams): StateTransitionWASM {
  const { class: TransitionClass, arguments: classArguments, optionalArguments } = tokenTransitionsMap[type]

  if (TransitionClass == null) {
    throw new Error(`Unimplemented transition type: ${type}`)
  }

  // check if all required params for token transition exists
  const [missingArgument] = classArguments
    .filter((classArgument: string) => params[classArgument] == null &&
          !(optionalArguments as string[]).includes(classArgument))

  if (missingArgument != null) {
    throw new Error(`Token transition param ${missingArgument} is missing`)
  }

  const transitionParams = classArguments.map((classArgument: string) => params[classArgument])

  // @ts-expect-error
  const tokenTransition = new TransitionClass(base, ...transitionParams)

  const tokenTransitionWASM = new TokenTransitionWASM(tokenTransition)

  const batchedTransition = new BatchedTransitionWASM(tokenTransitionWASM)

  return BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], ownerId, 1).toStateTransition()
}
