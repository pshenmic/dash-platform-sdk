import { DataContractCreateTransitionWASM, DataContractWASM, PlatformVersionWASM } from 'pshenmic-dpp'

export default async function updateDataContractTransition (
  dataContract: DataContractWASM,
  identityNonce: bigint,
  platformVersion: PlatformVersionWASM | undefined = PlatformVersionWASM.PLATFORM_V1
): Promise<DataContractCreateTransitionWASM> {
  const dataContractTransition = new this.wasm.DataContractUpdateTransitionWASM(dataContract, identityNonce, platformVersion)

  return dataContractTransition.toStateTransition()
}
