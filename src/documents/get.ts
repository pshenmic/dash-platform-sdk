import { GetDocumentsRequest } from '../../proto/generated/platform.js'
import { base58 } from '@scure/base'
import { encode } from 'cbor'
import { DocumentWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import getByIdentifier from '../dataContracts/getByIdentifier'

export default async function get (
  dataContractId: string,
  documentType: string,
  where?: ArrayLike<any>,
  orderBy?: ArrayLike<any>,
  limit: number | undefined = 100,
  startAt?: Uint8Array<ArrayBufferLike> | undefined,
  startAfter?: Uint8Array<ArrayBufferLike> | undefined
): Promise<[DocumentWASM]> {
  const getDocumentsRequest = GetDocumentsRequest.fromPartial({
    v0: {
      dataContractId: base58.decode(dataContractId),
      documentType,
      where: (where != null) ? encode(where) : undefined,
      orderBy: (orderBy != null) ? encode(orderBy) : undefined,
      limit,
      startAt: startAt != null ? startAt : undefined,
      startAfter: startAfter != null ? startAfter : undefined
    }
  })

  const dataContract = await getByIdentifier.bind(this)(dataContractId)

  const { v0 } = await this.grpcPool.getClient().getDocuments(getDocumentsRequest)

  return v0.documents.documents.map(document => DocumentWASM.fromBytes(document, dataContract, documentType, PlatformVersionWASM.PLATFORM_V1))
}
