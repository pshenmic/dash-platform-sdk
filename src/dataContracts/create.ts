import {
  DataContractTokens,
  DataContractWASM,
  IdentifierWASM,
  PlatformVersionWASM
} from 'pshenmic-dpp'
import { DataContractConfig, IdentifierLike } from '../../types.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default function createDataContract (
  ownerId: IdentifierLike,
  identityNonce: bigint,
  schema: object,
  tokenConfiguration?: DataContractTokens[],
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
    undefined,
    tokenConfiguration,
    fullValidation ?? true,
    platformVersion ?? LATEST_PLATFORM_VERSION
  )

  if (config != null) {
    dataContract.setConfig(config, platformVersion)
  }

  return dataContract
}
