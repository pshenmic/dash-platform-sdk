import { DataContractWASM, IdentifierWASM, PlatformVersionWASM, verifyContractProof } from 'pshenmic-dpp'
import {
  GetDataContractRequest,
  GetDataContractResponse_GetDataContractResponseV0
} from '../../proto/generated/platform'
import { IdentifierLike } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export default async function getByIdentifier (grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<DataContractWASM> {
  const id = new IdentifierWASM(identifier)
  const getDataContractRequest = GetDataContractRequest.fromPartial({
    v0: {
      id: id.bytes(),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getDataContract(getDataContractRequest)

  const { proof, metadata } = v0 as GetDataContractResponse_GetDataContractResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    rootHash,
    dataContract
  } = verifyContractProof(proof.grovedbProof, undefined, false, false, id.bytes(), PlatformVersionWASM.PLATFORM_V9)

  if (dataContract == null) {
    throw new Error(`Data Contract with identifier ${id.base58()} not found`)
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return dataContract
}
