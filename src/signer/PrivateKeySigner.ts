// import { IdentityWASM, NetworkWASM, PrivateKeyWASM, StateTransitionWASM } from 'pshenmic-dpp'
// import { base64 } from '@scure/base'
// import { IdentitiesController } from '../identities'
// import {AbstractSigner} from "./AbstractSigner";
//
// export class PrivateKeySigner implements AbstractSigner {
//   privateKey: PrivateKeyWASM
//   identity: IdentityWASM
//   identities: IdentitiesController
//
//   constructor (identitiesController: IdentitiesController, privateKey: string | PrivateKeyWASM, network?: NetworkWASM | string) {
//     this.identities = identitiesController
//
//     if (typeof privateKey === 'string') {
//       let privateKeyWASM
//
//       try {
//         privateKeyWASM = PrivateKeyWASM.fromWIF(privateKey)
//       } catch (e) {
//       }
//
//       if (privateKey.length === 64 && !network) {
//         throw new Error('Network must be specified if hex or base64 private key being used')
//       }
//
//       try {
//         privateKeyWASM = PrivateKeyWASM.fromHex(privateKey, network)
//       } catch (e) {
//       }
//
//       try {
//         privateKeyWASM = PrivateKeyWASM.fromBytes(base64.decode(privateKey), network)
//       } catch (e) {
//       }
//
//       if (privateKeyWASM == null) {
//         throw new Error('Could not decode private key')
//       }
//     } else if (privateKey?.__type === 'PrivateKeyWASM') {
//       this.privateKey = privateKey
//     } else {
//       throw new Error('Unrecognized private key type')
//     }
//   }
//
//   async connect (): Promise<void> {
//     this.identity = await this.identities.getIdentityByPublicKeyHash(this.privateKey.getPublicKeyHash())
//   }
//
//   getCurrentIdentity (): IdentityWASM {
//     return this.identity
//   }
//
//   signStateTransition (stateTransition: StateTransitionWASM): void {
//     const [identityPublicKey] = this.identity.getPublicKeys()
//       .filter(identityPublicKey => identityPublicKey.getPublicKeyHash() === this.privateKey.getPublicKeyHash())
//
//     if (identityPublicKey == null) {
//       throw new Error('Could not find an identity public key of identity matching this private key')
//     }
//
//     stateTransition.sign(this.privateKey, identityPublicKey)
//   }
// }
