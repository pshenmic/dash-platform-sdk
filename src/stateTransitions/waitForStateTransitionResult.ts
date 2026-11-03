import {
  BatchTransitionWASM,
  BlockInfo,
  DataContractWASM,
  StateTransitionWASM,
  MasternodeVoteTransitionWASM,
  verifyStateTransitionResult
} from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import hexToBytes from '../utils/hexToBytes.js'
import { StateTransitionBroadcastError, WaitForStateTransitionResultRequest } from '../../proto/generated/platform.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
import { base64 } from '@scure/base'
import { LATEST_PLATFORM_VERSION, WITHDRAWALS_DATA_CONTRACT_ID } from '../constants.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'

function toStateTransitionError (txHash: string, { code, message, data }: StateTransitionBroadcastError): Error {
  return new Error(`State transition ${txHash} failed to execute with code ${String(code)}, message: ${String(message)}, data: ${base64.encode(data)}`)
}

export default async function waitForStateTransitionResult (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, stateTransition: StateTransitionWASM): Promise<bigint | undefined> {
  const txHash = stateTransition.hash(false)

  const waitForStateTransitionResultRequest = WaitForStateTransitionResultRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        stateTransitionHash: hexToBytes(txHash),
        prove: true,
        requestUserBalance: false
      }
    }
  })

  // contracts are fetched before the request, so their proof errors are not attributed to the node of the request
  const knownContracts: DataContractWASM[] = []

  if (stateTransition.getActionType() === 'BATCH') {
    const batchTransition = BatchTransitionWASM.fromStateTransition(stateTransition)
    const [transition] = batchTransition.transitions

    knownContracts.push(await getDataContractByIdentifier(grpcPool, quorumKeyProvider, transition.dataContractId))
  }

  if (stateTransition.getActionType() === 'MASTERNODE_VOTE') {
    const masternodeVote = MasternodeVoteTransitionWASM.fromStateTransition(stateTransition)

    knownContracts.push(await getDataContractByIdentifier(grpcPool, quorumKeyProvider, masternodeVote.vote.votePoll.contractId))
  }

  // withdrawal documents of the shielded pool are created in the withdrawals system contract
  if (stateTransition.getActionType() === 'SHIELDED_WITHDRAWAL') {
    knownContracts.push(await getDataContractByIdentifier(grpcPool, quorumKeyProvider, WITHDRAWALS_DATA_CONTRACT_ID))
  }

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .setGrpcRequest('waitForStateTransitionResult', waitForStateTransitionResultRequest)
    // the result is always verified, also if proofs are disabled in the pool
    .setRequireProof(true)
    .mapProof(response => {
      const { version } = response

      if (version.oneofKind !== 'v0') {
        throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
      }

      const { v0 } = version

      if (v0.result.oneofKind === 'error') {
        throw toStateTransitionError(txHash, v0.result.error)
      }

      return getResponseProof(response)
    })
    .setProofVerifier(verifyStateTransitionResult, ({ metadata }) => {
      const { timeMs, height, coreChainLockedHeight, epoch } = metadata

      const blockInfo: BlockInfo = {
        timeMs: BigInt(timeMs),
        height: BigInt(height),
        coreHeight: coreChainLockedHeight,
        epoch
      }

      return [stateTransition, blockInfo, knownContracts, Math.min(metadata.protocolVersion, LATEST_PLATFORM_VERSION)]
    })
    .mapResponse(data => {
      if (!data.proved) {
        throw new Error('State transition result must be proved')
      }

      if (data.verified.result == null) {
        throw new Error('State transition result was null')
      }

      return data.verified.ownerBalance
    })
    .execute()
}
