import { DataContractWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'

export default async function createDataContract (
  ownerId: IdentifierLike,
  identityNonce: bigint,
  schema: object,
  definitions?: object,
  fullValidation: boolean | undefined = true,
  platformVersion: PlatformVersionWASM | undefined = PlatformVersionWASM.PLATFORM_V1
): Promise<DataContractWASM> {
  return new this.wasm.DataContractWASM(
    ownerId,
    identityNonce,
    schema,
    definitions,
    fullValidation,
    platformVersion
  )
}
