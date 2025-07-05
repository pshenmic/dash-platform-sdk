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

export default async function createStateTransition (dataContract: DataContractWASM, type: DataContractTransitionType, identityContractNonce: bigint): Promise<StateTransitionWASM> {
  const TransitionClass = dataContractTransitionsMap[type]

  if (TransitionClass == null) {
    throw new Error(`Unknown DataContract transition type: ${type}`)
  }

  // @ts-expect-error
  const dataContractTransition = new TransitionClass(dataContract, identityContractNonce)

  return dataContractTransition.toStateTransition()
}
