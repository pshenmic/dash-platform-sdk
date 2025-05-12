import { GetDocumentsRequest } from '../../proto/generated/platform.js'
import { base58 } from '@scure/base'
import { encode } from 'cbor'
import { DocumentWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import getByIdentifier from '../dataContracts/getByIdentifier'

export default async function get (dataContractId, documentType, where, orderBy, limit = 100, startAt, startAfter) {
  const getDocumentsRequest = GetDocumentsRequest.fromPartial({
    v0: {
      dataContractId: base58.decode(dataContractId),
      documentType,
      where: where ? encode(where) : undefined,
      orderBy: orderBy ? encode(orderBy) : undefined,
      limit,
      startAt: startAt || undefined,
      startAfter: startAfter || undefined
    }
  })

  const dataContract = await getByIdentifier.bind(this)(dataContractId)

  const { v0 } = await this.grpcPool.getClient().getDocuments(getDocumentsRequest)

  return v0.documents.documents.map(document => DocumentWASM.fromBytes(document, dataContract, documentType, PlatformVersionWASM.PLATFORM_V1))
}
