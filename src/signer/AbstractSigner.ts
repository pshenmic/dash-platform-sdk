import { StateTransitionWASM } from 'pshenmic-dpp'

export interface ConnectInfo {
  identities: string[]
  currentIdentity: string | null
}

export interface AbstractSigner {
  connect: () => Promise<ConnectInfo>
  signAndBroadcast: (stateTransition: StateTransitionWASM) => Promise<StateTransitionWASM>
}
