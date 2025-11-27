import { StateTransitionWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import hexToBytes from "../utils/hexToBytes.js";
import {WaitForStateTransitionResultRequest} from "../../proto/generated/platform.js";

export default async function waitForStateTransitionResult (grpcPool: GRPCConnectionPool, stateTransition: StateTransitionWASM): Promise<void> {
  const txHash = stateTransition.hash(false)

  const waitForStateTransitionResultRequest = WaitForStateTransitionResultRequest.create({
    version: {
      oneofKind: "v0",
      v0: {
        stateTransitionHash: hexToBytes(txHash),
        prove: false
      }
    }
  })

  const {response} = await grpcPool.getClient().waitForStateTransitionResult(waitForStateTransitionResultRequest)

  const { version } = response

  if (version.oneofKind !== 'v0') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
  }

  const { v0 } = version

  if (v0.result.oneofKind === undefined) {
    // all ok
    return
  } else if (v0.result.oneofKind === 'error') {
    const {code, data, message} = v0.result.error
    throw new Error(`State transition ${txHash} failed to execute with code ${code}, message: ${message}`)
  } else {
    throw new Error('Unexpected oneOfKind returned for waitForStateTransitionResult')
  }
}
