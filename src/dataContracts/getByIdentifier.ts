import { DataContractWASM, IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import {
  GetDataContractRequest,
  GetDataContractResponse_GetDataContractResponseV0
} from '../../proto/generated/platform'
import { IdentifierLike } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'

export default async function getByIdentifier (grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<DataContractWASM> {
  const id = new IdentifierWASM(identifier)
  const getDataContractRequest = GetDataContractRequest.fromPartial({
    v0: {
      id: id.bytes()
    }
  })

  const { v0 } = await grpcPool.getClient().getDataContract(getDataContractRequest)

  const { dataContract } = v0 as GetDataContractResponse_GetDataContractResponseV0

  if (dataContract == null) {
    throw new Error(`Data Contract with identifier ${id.base58()} not found`)
  }

  return DataContractWASM.fromBytes(dataContract, true, PlatformVersionWASM.PLATFORM_V1)
}
