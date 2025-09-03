import {
  IdentityCreateTransitionWASM,
  IdentityTopUpTransitionWASM,
  IdentityUpdateTransitionWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { IdentityTransitionParams } from '../types'

const identityTransitionsMap = {
  register: {
    class: IdentityCreateTransitionWASM,
    arguments: ['publicKeys', 'assetLockProof'],
    optionalArguments: ['signature', 'userFeeIncrease']
  },
  topUp: {
    class: IdentityTopUpTransitionWASM,
    arguments: ['assetLockProof', 'identityId'],
    optionalArguments: ['userFeeIncrease']
  },
  update: {
    class: IdentityUpdateTransitionWASM,
    arguments: ['identityId', 'revision', 'identityNonce', 'addPublicKeys', 'disablePublicKeyIds'],
    optionalArguments: ['userFeeIncrease']
  }
}

export default function createStateTransition (type: 'register' | 'update' | 'topUp', params: IdentityTransitionParams): StateTransitionWASM {
  const { class: TransitionClass, arguments: classArguments, optionalArguments } = identityTransitionsMap[type]

  if (TransitionClass == null) {
    throw new Error(`Unimplemented transition type: ${type}`)
  }

  const [missingArgument] = classArguments
    .filter((classArgument: string) => params[classArgument] == null &&
          !(optionalArguments).includes(classArgument))

  if (missingArgument != null) {
    throw new Error(`Token transition param "${missingArgument}" is missing`)
  }

  const transitionParams = classArguments.map((classArgument: string) => params[classArgument])

  // @ts-expect-error
  const identityTransition = new TransitionClass(...transitionParams)

  return identityTransition.toStateTransition()
}
