import { AgreedFeeMultiplierWASM, BatchTypeLike, DocumentActionFeeAgreementWASM, IdentifierLike } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'
import getEpochsInfo from '../node/epochInfos.js'
import { DocumentTransitionType } from '../../types.js'

const BATCH_TYPES: Record<DocumentTransitionType, BatchTypeLike> = {
  create: 'Create',
  replace: 'Replace',
  delete: 'Delete',
  updatePrice: 'UpdatePrice',
  transfer: 'Transfer',
  purchase: 'Purchase'
}

export default async function getActionFeeAgreement (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  dataContractId: IdentifierLike,
  documentTypeName: string,
  action: DocumentTransitionType,
  increaseTolerancePercent: number
): Promise<DocumentActionFeeAgreementWASM | undefined> {
  const dataContract = await getDataContractByIdentifier(grpcPool, quorumKeyProvider, dataContractId)

  // the current epoch: descending from the latest one
  const [currentEpoch] = await getEpochsInfo(grpcPool, quorumKeyProvider, 1, false)

  if (currentEpoch == null) {
    throw new Error('Current epoch not found')
  }

  const feeMultiplier = new AgreedFeeMultiplierWASM(currentEpoch.feeMultiplier, increaseTolerancePercent)

  return DocumentActionFeeAgreementWASM.forDocumentTypeAction(dataContract, documentTypeName, BATCH_TYPES[action], feeMultiplier)
}
