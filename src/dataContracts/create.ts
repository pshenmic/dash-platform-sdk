import { DataContractWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { DataContractConfig, IdentifierLike } from '../types'

export default async function createDataContract (
  ownerId: IdentifierLike,
  identityNonce: bigint,
  schema: object,
  definitions?: object,
  fullValidation: boolean | undefined = true,
  config?: DataContractConfig,
  platformVersion: PlatformVersionWASM | undefined = PlatformVersionWASM.PLATFORM_V1
): Promise<DataContractWASM> {
  const dataContract = new this.dpp.DataContractWASM(
    ownerId,
    identityNonce,
    schema,
    definitions,
    fullValidation,
    platformVersion
  )

  if (config != null) {
    dataContract.setConfig(config)
  }

  return dataContract
}
