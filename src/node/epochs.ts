import GRPCConnectionPool from '../grpcConnectionPool.js'
import { GetEpochsInfoRequest } from '../../proto/generated/platform.js'
import { PlatformVersionWASM, verifyEpochsInfoProof } from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import { UInt32Value } from '../../proto/generated/google/protobuf/wrappers.js'

export interface EpochInfo {
  number: number
  firstBlockHeight: number
  firstCoreBlockHeight: number
  startTime: bigint
  feeMultiplier: bigint
  protocolVersion: 9
}

export default async function epochs (grpcPool: GRPCConnectionPool, count: number, ascending: boolean, start?: number): Promise<EpochInfo[]> {
  const getEpochsInfoRequest = GetEpochsInfoRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        startEpoch: start != null ? UInt32Value.create({ value: start }) : undefined,
        count,
        ascending,
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getEpochsInfo(getEpochsInfoRequest)

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
    epochsInfo
  } = verifyEpochsInfoProof(
    proof.grovedbProof,
    metadata.epoch,
    start,
    count,
    ascending,
    PlatformVersionWASM.PLATFORM_V9
  )
  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return epochsInfo.map(info => ({
    number: info.index,
    firstBlockHeight: info.firstBlockHeight,
    firstCoreBlockHeight: info.firstCoreBlockHeight,
    startTime: info.firstBlockTime,
    feeMultiplier: info.feeMultiplierPermille,
    protocolVersion: info.protocolVersion
  })) as unknown as EpochInfo[]
}
