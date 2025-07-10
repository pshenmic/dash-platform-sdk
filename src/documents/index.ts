import get from './get'
import { CreateStateTransitionDocumentBatchParams, IdentifierLike } from '../types'
import createDocument from './create'
import { BatchType, DocumentWASM, IdentifierWASM, StateTransitionWASM } from 'pshenmic-dpp'
import createStateTransition from './createStateTransition'
import GRPCConnectionPool from '../grpcConnectionPool'

export class DocumentsController {
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  async create (dataContractId: IdentifierLike, documentType: string, data: object, owner: IdentifierLike, revision?: bigint): Promise<DocumentWASM> {
    return await createDocument(dataContractId, documentType, data, owner, revision)
  }

  async query (dataContractId: IdentifierLike, documentType: string, where?: ArrayLike<any>, orderBy?: ArrayLike<any>, limit: number | undefined = 100, startAt?: IdentifierWASM, startAfter?: IdentifierWASM): Promise<DocumentWASM[]> {
    return await get(this.grpcPool, dataContractId, documentType, where, orderBy, limit, startAt, startAfter)
  }

  async createStateTransition (document: DocumentWASM, batchType: BatchType, identityContractNonce: bigint, params?: CreateStateTransitionDocumentBatchParams): Promise<StateTransitionWASM> {
    return await createStateTransition(document, batchType, identityContractNonce, params)
  }
}
