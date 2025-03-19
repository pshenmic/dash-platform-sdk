import { GetDocumentsRequest } from '../../proto/generated/platform.js'
import { base58 } from '@scure/base'
import cbor from 'cbor'
import { DataContractWASM, DocumentWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { GetDataContractRequest } from '../../proto/generated/platform'

export default async function getByIdentifier(identifier) {
  const getDataContractRequest = new GetDataContractRequest.fromPartial({
    v0: {
      id: base58.decode(identifier),
    }
  })

  const { v0 } = await this.client.getDataContract(getDataContractRequest)

  const {dataContract} = v0

  if (!dataContract) {
    throw new Error(`Data Contract with identifier ${identifier} not found`)
  }

  return DataContractWASM.fromBytes(dataContract, true, PlatformVersionWASM.PLATFORM_V1)
}
