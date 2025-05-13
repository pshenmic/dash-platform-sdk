import { GetDocumentsRequest } from '../../proto/generated/platform.js'
import { encode } from 'cbor'
import { DocumentWASM, IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import getByIdentifier from '../dataContracts/getByIdentifier'
import { DAPI_DEFAULT_LIMIT } from '../constants'
import {IdentifierLike} from "../index";

export default async function get (dataContractId: IdentifierLike, documentType: string, where?: object, orderBy?: object, limit?: number, startAt?: IdentifierWASM, startAfter?: IdentifierWASM): Promise< DocumentWASM[]> {
  const getDocumentsRequest = GetDocumentsRequest.fromPartial({
    v0: {
      dataContractId: (new IdentifierWASM(dataContractId)).bytes(),
      documentType,
      where: (where != null) ? encode(where) : undefined,
      orderBy: (orderBy != null) ? encode(orderBy) : undefined,
      limit: limit ?? DAPI_DEFAULT_LIMIT,
      startAt: (startAt != null) ? startAt.bytes() : undefined,
      startAfter: (startAfter != null) ? startAfter.bytes() : undefined
    }
  })

  const dataContract = await getByIdentifier.bind(this)(dataContractId)

  const { v0 } = await this.grpcPool.getClient().getDocuments(getDocumentsRequest)

  return v0.documents.documents.map(document => DocumentWASM.fromBytes(document, dataContract, documentType, PlatformVersionWASM.PLATFORM_V1))
}
