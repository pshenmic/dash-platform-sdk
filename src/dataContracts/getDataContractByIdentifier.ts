import { DataContractWASM, IdentifierLike, IdentifierWASM, verifyContractProof } from 'pshenmic-dpp'
import { GetDataContractRequest } from '../../proto/generated/platform.js'
import { GRPCPool } from '../grpcConnectionPool.js'
import QueryExecutor from '../QueryExecutor.js'
import { DPNS_DATA_CONTRACT_BYTES, DPNS_DATA_CONTRACT_ID, LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getByIdentifier (grpcPool: GRPCPool, identifier: IdentifierLike): Promise<DataContractWASM> {
  const id = new IdentifierWASM(identifier)

  if (id.base58() === DPNS_DATA_CONTRACT_ID) {
    return DataContractWASM.fromBase64(DPNS_DATA_CONTRACT_BYTES, true, 9)
  }

  const getDataContractRequest = GetDataContractRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        id: id.bytes(),
        prove: true
      }
    }
  })

  return await QueryExecutor.build(grpcPool)
    .setGrpcRequest('getDataContract', getDataContractRequest)
    .setProofVerifier(verifyContractProof, undefined, false, false, id.bytes(), LATEST_PLATFORM_VERSION)
    .mapResponse(data => {
      const dataContract = data.proved
        ? data.verified.dataContract
        : DataContractWASM.fromBytes(data.result.dataContract, false, LATEST_PLATFORM_VERSION)

      if (dataContract == null) {
        throw new Error(`Data Contract with identifier ${id.base58()} not found`)
      }

      return dataContract
    })
    .execute()
}
