import { StateTransitionWASM } from 'pshenmic-dpp'

export interface AppConnectInfo {
  identities: string[]
  currentIdentity: string | null
}

export interface AbstractSigner {
  connect: () => Promise<AppConnectInfo>
  signAndBroadcast: (stateTransition: StateTransitionWASM) => Promise<StateTransitionWASM>
}
