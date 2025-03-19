import { GetDataContractRequest } from '../../proto/generated/platform.js'
import { base58 } from '@scure/base'
import { DataContractWASM, PlatformVersionWASM } from 'pshenmic-dpp'

export default async function getByIdentifier (identifier) {
  // eslint-disable-next-line new-cap
  const getDataContractRequest = new GetDataContractRequest.fromPartial({
    v0: {
      id: base58.decode(identifier)
    }
  })

  const { v0 } = await this.grpcPool.getClient().getDataContract(getDataContractRequest)

  const { dataContract } = v0

  if (!dataContract) {
    throw new Error(`Data Contract with identifier ${identifier} not found`)
  }

  return DataContractWASM.fromBytes(dataContract, true, PlatformVersionWASM.PLATFORM_V1)
}
