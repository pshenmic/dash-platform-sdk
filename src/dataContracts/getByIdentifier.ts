import { DataContractWASM, IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { GetDataContractRequest } from '../../proto/generated/platform'
import { IdentifierLike } from '../types'

export default async function getByIdentifier (identifier: IdentifierLike): Promise<DataContractWASM> {
  const id = new IdentifierWASM(identifier)
  const getDataContractRequest = GetDataContractRequest.fromPartial({
    v0: {
      id: id.bytes()
    }
  })

  const { v0 } = await this.grpcPool.getClient().getDataContract(getDataContractRequest)

  const { dataContract } = v0

  if (dataContract == null) {
    throw new Error(`Data Contract with identifier ${id.base58()} not found`)
  }

  return this.dpp.DataContractWASM.fromBytes(dataContract, true, PlatformVersionWASM.PLATFORM_V1)
}
