import {
  IdentityCreateTransitionWASM,
  IdentityTopUpTransitionWASM,
  IdentityUpdateTransitionWASM,
  IdentityCreditTransferWASM,
  StateTransitionWASM,
  IdentityCreditWithdrawalTransitionWASM
} from 'pshenmic-dpp'
import { IdentityTransitionParams } from '../../types.js'

const identityTransitionsMap = {
  create: {
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
  },
  creditTransfer: {
    class: IdentityCreditTransferWASM,
    arguments: ['identityId', 'amount', 'recipientId', 'identityNonce'],
    optionalArguments: ['userFeeIncrease']
  },
  withdrawal: {
    class: IdentityCreditWithdrawalTransitionWASM,
    arguments: ['identityId', 'amount', 'coreFeePerByte', 'pooling', 'identityNonce', 'outputScript'],
    optionalArguments: ['userFeeIncrease']
  }
}

export default function createStateTransition (type: 'create' | 'update' | 'topUp' | 'creditTransfer' | 'withdrawal', params: IdentityTransitionParams): StateTransitionWASM {
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
