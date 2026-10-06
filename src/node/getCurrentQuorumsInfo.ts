import { GRPCPool } from '../grpcConnectionPool.js'
import { GetCurrentQuorumsInfoRequest } from '../../proto/generated/platform.js'
import bytesToHex from '../utils/bytesToHex.js'

export interface Validator {
  proTxHash: string
  nodeIp: string
  isBanned: boolean
}

export interface ValidatorSet {
  quorumHash: string
  coreHeight: number
  members: Validator[]
  thresholdPublicKey: string
}

export interface CurrentQuorumsInfo {
  quorumHashes: string[]
  currentQuorumHash: string
  validatorSets: ValidatorSet[]
  lastBlockProposer: string
}

export default async function getCurrentQuorumsInfo (grpcPool: GRPCPool): Promise<CurrentQuorumsInfo> {
  const getCurrentQuorumsInfoRequest = GetCurrentQuorumsInfoRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {}
    }
  })

  const { response } = await grpcPool.getClient().getCurrentQuorumsInfo(getCurrentQuorumsInfoRequest)

  const { version } = response

  if (version.oneofKind !== 'v0') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
  }

  const { v0 } = version

  return {
    quorumHashes: v0.quorumHashes.map(bytesToHex),
    currentQuorumHash: bytesToHex(v0.currentQuorumHash),
    validatorSets: v0.validatorSets.map(validatorSet => ({
      quorumHash: bytesToHex(validatorSet.quorumHash),
      coreHeight: validatorSet.coreHeight,
      members: validatorSet.members.map(member => ({
        proTxHash: bytesToHex(member.proTxHash),
        nodeIp: member.nodeIp,
        isBanned: member.isBanned
      })),
      thresholdPublicKey: bytesToHex(validatorSet.thresholdPublicKey)
    })),
    lastBlockProposer: bytesToHex(v0.lastBlockProposer)
  }
}
