import {
  BatchTransitionWASM,
  BlockInfo,
  DataContractWASM,
  StateTransitionWASM,
  MasternodeVoteTransitionWASM,
  verifyStateTransitionResult
} from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import hexToBytes from '../utils/hexToBytes.js'
import { StateTransitionBroadcastError, WaitForStateTransitionResultRequest } from '../../proto/generated/platform.js'
import QueryExecutor, { getResponseProof } from '../QueryExecutor.js'
import { base64 } from '@scure/base'
import { LATEST_PLATFORM_VERSION } from '../constants.js'
import getDataContractByIdentifier from '../dataContracts/getDataContractByIdentifier.js'

function toStateTransitionError (txHash: string, { code, message, data }: StateTransitionBroadcastError): Error {
  return new Error(`State transition ${txHash} failed to execute with code ${String(code)}, message: ${String(message)}, data: ${base64.encode(data)}`)
}

export default async function waitForStateTransitionResult (grpcPool: GRPCPool, stateTransition: StateTransitionWASM): Promise<bigint | undefined> {
  const txHash = stateTransition.hash(false)

  const waitForStateTransitionResultRequest = WaitForStateTransitionResultRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        stateTransitionHash: hexToBytes(txHash),
        prove: true,
        // without proof the owner balance is returned only if requested
        requestUserBalance: grpcPool.proofs === false
      }
    }
  })

  // contracts are fetched before the request, so their proof errors are not attributed to the node of the request
  const knownContracts: DataContractWASM[] = []

  if (stateTransition.getActionType() === 'BATCH') {
    const batchTransition = BatchTransitionWASM.fromStateTransition(stateTransition)
    const [transition] = batchTransition.transitions

    knownContracts.push(await getDataContractByIdentifier(grpcPool, transition.dataContractId))
  }

  if (stateTransition.getActionType() === 'MASTERNODE_VOTE') {
    const masternodeVote = MasternodeVoteTransitionWASM.fromStateTransition(stateTransition)

    knownContracts.push(await getDataContractByIdentifier(grpcPool, masternodeVote.vote.votePoll.contractId))
  }

  return await QueryExecutor.build(grpcPool)
    .addGrpcRequest('waitForStateTransitionResult', waitForStateTransitionResultRequest)
    .setProofExtractor(response => {
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
    .addProofVerifier(verifyStateTransitionResult, ({ metadata }) => {
      const { timeMs, height, coreChainLockedHeight, epoch } = metadata

      const blockInfo: BlockInfo = {
        timeMs: BigInt(timeMs),
        height: BigInt(height),
        coreHeight: coreChainLockedHeight,
        epoch
      }

      return [stateTransition, blockInfo, knownContracts, LATEST_PLATFORM_VERSION]
    })
    .addMapper(data => {
      if (data.proved) {
        if (data.verified.result == null) {
          throw new Error('State transition result was null')
        }

        return data.verified.ownerBalance
      }

      if (data.result.oneofKind === 'error') {
        throw toStateTransitionError(txHash, data.result.error)
      }

      return BigInt(data.result.successWithOwnerBalance.ownerBalance)
    })
    .execute()
}
