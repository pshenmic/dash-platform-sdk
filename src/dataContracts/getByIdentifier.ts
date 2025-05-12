import { PlatformVersionWASM } from 'pshenmic-dpp'
import { GetDataContractRequest } from '../../proto/generated/platform'
import parseIdentifier from '../utils/parseIdentifier'

export default async function GetByIdentifier (identifier: string) {
  const getDataContractRequest = GetDataContractRequest.fromPartial({
    v0: {
      id: parseIdentifier(identifier)
    }
  })

  const { v0 } = await this.grpcPool.getClient().getDataContract(getDataContractRequest)

  const { dataContract } = v0

  if (!dataContract) {
    throw new Error(`Data Contract with identifier ${identifier} not found`)
  }

  return this.wasm.DataContractWASM.fromBytes(dataContract, true, PlatformVersionWASM.PLATFORM_V1)
}
