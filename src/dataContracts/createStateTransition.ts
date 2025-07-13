import {
  DataContractCreateTransitionWASM, DataContractUpdateTransitionWASM,
  DataContractWASM, StateTransitionWASM
} from 'pshenmic-dpp'

export enum DataContractTransitionType {
  Create = 0,
  Update = 1
}

const dataContractTransitionsMap = {
  [DataContractTransitionType.Create]: DataContractCreateTransitionWASM,
  [DataContractTransitionType.Update]: DataContractUpdateTransitionWASM
}

export default function createStateTransition (dataContract: DataContractWASM, type: DataContractTransitionType, identityNonce: bigint): StateTransitionWASM {
  const TransitionClass = dataContractTransitionsMap[type]

  if (TransitionClass == null) {
    throw new Error(`Unknown DataContract transition type: ${type}`)
  }

  // @ts-expect-error
  const dataContractTransition = new TransitionClass(dataContract, identityNonce)

  return dataContractTransition.toStateTransition()
}
