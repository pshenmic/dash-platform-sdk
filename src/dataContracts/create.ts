import { DataContractWASM, IdentifierWASM, PlatformVersionWASM, TokenConfigurationWASM } from 'pshenmic-dpp'
import { DataContractConfig, IdentifierLike } from '../types'

export default function createDataContract (
  ownerId: IdentifierLike,
  identityNonce: bigint,
  schema: object,
  tokenConfiguration?: TokenConfigurationWASM,
  config?: DataContractConfig,
  fullValidation?: boolean | undefined,
  platformVersion?: PlatformVersionWASM | undefined
): DataContractWASM {
  const id = new IdentifierWASM(ownerId)

  const dataContract = new DataContractWASM(
    id,
    identityNonce,
    schema,
    // we don't know what that param means yet
    null,
    tokenConfiguration,
    fullValidation ?? true,
    platformVersion ?? PlatformVersionWASM.PLATFORM_V9
  )

  if (config != null) {
    dataContract.setConfig(config, platformVersion)
  }

  return dataContract
}
