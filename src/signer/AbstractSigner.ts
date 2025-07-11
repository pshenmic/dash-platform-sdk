import { StateTransitionWASM } from 'pshenmic-dpp'

export interface WalletInfo {
  identities: string[]
  currentIdentity: string | null
}

/**
 * Abstract interface for custom signer implementation
 */
export interface AbstractSigner {
  connect: () => Promise<WalletInfo>
  signAndBroadcast: (stateTransition: StateTransitionWASM) => Promise<StateTransitionWASM>
}
