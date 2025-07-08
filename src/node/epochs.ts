import GRPCConnectionPool from '../grpcConnectionPool'
import {
  GetEpochsInfoRequest,
  GetEpochsInfoResponse_GetEpochsInfoResponseV0,
  GetEpochsInfoResponse_GetEpochsInfoResponseV0_EpochInfo
} from '../../proto/generated/platform'
import {verifyEpochInfos} from "wasm-drive-verify";
import {PlatformVersionWASM} from "pshenmic-dpp";
import {getQuorumPublicKey} from "../utils/getQuorumPublicKey";
import bytesToHex from "../utils/bytesToHex";
import verifyTenderdashProof from "../utils/verifyTenderdashProof";

export type EpochInfo = {
  number: number;
  firstBlockHeight: number;
  firstCoreBlockHeight: number;
  startTime: bigint;
  feeMultiplier: bigint;
  protocolVersion: 9;
}

export default async function epochs (grpcPool: GRPCConnectionPool, count: number, ascending: boolean, start?: number): Promise<EpochInfo[]> {
  const request = GetEpochsInfoRequest.fromPartial({
    v0: {
      startEpoch: start,
      count,
      ascending,
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getEpochsInfo(request)

  const {proof, metadata} = v0 as GetEpochsInfoResponse_GetEpochsInfoResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    epoch_infos: epochInfos
  } = verifyEpochInfos(
    proof.grovedbProof,
    metadata.epoch,
    start,
    count,
    ascending,
    PlatformVersionWASM.PLATFORM_V9
  )
  const quorumPublicKey = await getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return epochInfos as EpochInfo[]
}
