import { DataContractWASM, IdentifierWASM, verifyContractProof } from 'pshenmic-dpp'
import { GetDataContractRequest } from '../../proto/generated/platform.js'
import { IdentifierLike } from '../types.js'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import {DPNS_DATA_CONTRACT_BYTES, DPNS_DATA_CONTRACT_ID, LATEST_PLATFORM_VERSION} from '../constants.js'

export default async function getByIdentifier (grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<DataContractWASM> {
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

  const { response } = await grpcPool.getClient().getDataContract(getDataContractRequest)

  const { version } = response

  if (version.oneofKind !== 'v0') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
  }

  const { v0 } = version

  if (v0.result.oneofKind !== 'proof') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be proof)')
  }

  const { result: { proof }, metadata } = v0

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    rootHash,
    dataContract
  } = verifyContractProof(proof.grovedbProof, undefined, false, false, id.bytes(), LATEST_PLATFORM_VERSION)

  if (dataContract == null) {
    throw new Error(`Data Contract with identifier ${id.base58()} not found`)
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return dataContract
}
