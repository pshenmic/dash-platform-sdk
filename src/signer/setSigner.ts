import { AbstractSigner } from './AbstractSigner'

export default function setSigner (signer: AbstractSigner): void {
  this.signer = signer
  this.signer.identities = this.identities
  this.signer.setSigner = setSigner
}
