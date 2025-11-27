import {
  BlockInfoWASM,
  PlatformVersionWASM,
  StateTransitionWASM,
  verifyStateTransitionResult
} from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import hexToBytes from '../utils/hexToBytes.js'
import { WaitForStateTransitionResultRequest } from '../../proto/generated/platform.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import { base64 } from '@scure/base'

export default async function waitForStateTransitionResult (grpcPool: GRPCConnectionPool, stateTransition: StateTransitionWASM): Promise<void> {
  const txHash = stateTransition.hash(false)

  const waitForStateTransitionResultRequest = WaitForStateTransitionResultRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        stateTransitionHash: hexToBytes(txHash),
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().waitForStateTransitionResult(waitForStateTransitionResultRequest)

  const { version } = response

  if (version.oneofKind !== 'v0') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
  }

  const { v0 } = version

  if (v0.result.oneofKind !== 'proof' && v0.result.oneofKind !== 'error') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be proof)')
  }

  if (v0.result.oneofKind === 'proof') {
    const { result: { proof }, metadata } = v0

    if (metadata == null) {
      throw new Error('Metadata not found')
    }

    const { timeMs, height, coreChainLockedHeight, epoch } = metadata

    const {
      rootHash,
      result
    } = verifyStateTransitionResult(proof.grovedbProof, stateTransition, new BlockInfoWASM(BigInt(timeMs), BigInt(height), coreChainLockedHeight, epoch), true, PlatformVersionWASM.PLATFORM_V9)

    if (result == null) {
      throw new Error('State transition result was null')
    }

    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

    if (!verify) {
      throw new Error('Failed to verify wait for state transition result query')
    }
  } else if (v0.result.oneofKind === 'error') {
    const { code, message, data } = v0.result.error
    throw new Error(`State transition ${txHash} failed to execute with code ${code}, message: ${message}, data: ${base64.encode(data)}`)
  } else {
    throw new Error('Unexpected oneOfKind returned for waitForStateTransitionResult')
  }
}
