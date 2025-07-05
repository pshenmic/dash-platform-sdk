import { DataContractWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { DataContractConfig, IdentifierLike } from '../types'

export default async function createDataContract (
  ownerId: IdentifierLike,
  identityNonce: bigint,
  schema: object,
  definitions?: object,
  tokenConfiguration?: object,
  config?: DataContractConfig,
  fullValidation: boolean | undefined = true,
  platformVersion: PlatformVersionWASM | undefined = PlatformVersionWASM.PLATFORM_V1
): Promise<DataContractWASM> {
  const dataContract = new DataContractWASM(
    ownerId,
    identityNonce,
    schema,
    definitions,
    tokenConfiguration,
    fullValidation,
    platformVersion
  )

  if (config != null) {
    dataContract.setConfig(config, platformVersion)
  }

  return dataContract
}
