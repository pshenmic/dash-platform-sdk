import { DataContractWASM, IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { GetDataContractRequest } from '../../proto/generated/platform'

export default async function GetByIdentifier (identifier: string): Promise<DataContractWASM> {
  const getDataContractRequest = GetDataContractRequest.fromPartial({
    v0: {
      id: new IdentifierWASM(identifier).bytes()
    }
  })

  const { v0 } = await this.grpcPool.getClient().getDataContract(getDataContractRequest)

  const { dataContract } = v0

  if (dataContract == null) {
    throw new Error(`Data Contract with identifier ${identifier} not found`)
  }

  return this.wasm.DataContractWASM.fromBytes(dataContract, true, PlatformVersionWASM.PLATFORM_V1)
}
