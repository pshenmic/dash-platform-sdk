import { DataContractCreateTransitionWASM, DataContractWASM, PlatformVersionWASM } from 'pshenmic-dpp'

export default async function createDataContractTransition (
  dataContract: DataContractWASM,
  identityNonce: bigint,
  platformVersion: PlatformVersionWASM | undefined = PlatformVersionWASM.PLATFORM_V1
): Promise<DataContractCreateTransitionWASM> {
  return new this.wasm.DataContractCreateTransitionWASM(dataContract, identityNonce, platformVersion)
}
