import { StateTransitionWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool.js'

export default async function waitForStateTransitionResult (grpcPool: GRPCConnectionPool, stateTransition: StateTransitionWASM): Promise<void> {
  const url = `https://${grpcPool.network === 'mainnet' ? '' : 'testnet.'}platform-explorer.pshenmic.dev/waitForStateTransitionResult/${stateTransition.hash(false)}`

  const resp = await fetch(url)

  if (resp.status !== 200) {
    console.log(await resp.json())
    throw new Error('Internal server error while waiting for state transition result')
  }
}
