import { GetDocumentsRequest } from '../../proto/generated/platform.js'
import { base58 } from '@scure/base'
import cbor from 'cbor'

export default async function getDocuments(dataContractId, documentType, where, orderBy, limit = 100, startAt, startAfter, prove = false) {
  const getDocumentsRequest = new GetDocumentsRequest.fromPartial({
    v0: {
      dataContractId: base58.decode(dataContractId),
      documentType,
      where: where ? cbor.encode(where) : undefined,
      orderBy: orderBy ? cbor.encode(orderBy): undefined,
      limit,
      startAt : startAt ? startAt : undefined,
      startAfter : startAfter ? startAfter : undefined,
      prove
    }
  })

  const { v0 } = await this.client.getDocuments(getDocumentsRequest)

  return v0.documents.documents
}

//*
//
//   message GetDocumentsRequestV0 {
//     // Specifies the starting point for the document retrieval
//     oneof start {
//       bytes start_after = 6;  // Start retrieval after this document
//       bytes start_at = 7;     // Start retrieval at this document
//     }
//     bool prove = 8;  // Flag to request a proof as the response
//   }*/
