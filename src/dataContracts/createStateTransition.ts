import {
  DataContractCreateTransitionWASM, DataContractUpdateTransitionWASM,
  DataContractWASM, StateTransitionWASM
} from 'pshenmic-dpp'

export enum DataContractTransitionType {
  Create = 0,
  Update = 1
}

const dataContractTransitionsMap = {
  create: DataContractCreateTransitionWASM,
  update: DataContractUpdateTransitionWASM
}

export default function createStateTransition (dataContract: DataContractWASM, type: 'create' | 'update', identityNonce: bigint): StateTransitionWASM {
  const TransitionClass = dataContractTransitionsMap[type]

  if (TransitionClass == null) {
    throw new Error(`Unknown DataContract transition type: ${type}. Should be 'create' or 'update'.`)
  }

  // @ts-expect-error
  const dataContractTransition = new TransitionClass(dataContract, identityNonce)

  return dataContractTransition.toStateTransition()
}
