import {
  DataContractWASM,
  PlatformVersionWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'

export default async function updateDataContractTransition (
  dataContract: DataContractWASM,
  identityNonce: bigint,
  platformVersion: PlatformVersionWASM | undefined = PlatformVersionWASM.PLATFORM_V1
): Promise<StateTransitionWASM> {
  const dataContractTransition = new this.dpp.DataContractUpdateTransitionWASM(dataContract, identityNonce, platformVersion)

  return dataContractTransition.toStateTransition()
}
