import {
  DataContractWASM,
  PlatformVersionWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'

export default async function createDataContractTransition (
  dataContract: DataContractWASM,
  identityNonce: bigint,
  platformVersion: PlatformVersionWASM | undefined = PlatformVersionWASM.PLATFORM_V1
): Promise<StateTransitionWASM> {
  const dataContractTransition = new this.dpp.DataContractCreateTransitionWASM(dataContract, identityNonce, platformVersion)

  return dataContractTransition.toStateTransition()
}
