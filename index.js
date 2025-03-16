import {
  PlatformDefinition,
} from './proto/generated/platform.js';
import {createChannel, createClient} from 'nice-grpc-web';
import getStatus from './src/dapi/getStatus'

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const DEFAULT_OPTIONS = {
  network: 'testnet',
  dapiUrls: ['https://52.33.28.47:1443'],
}

export default class DashPlatformSDK {

  constructor (options = DEFAULT_OPTIONS) {
    this.network = options.network;
    this.dapiUrls = options.dapiUrls

    const [dapiUrl] = this.dapiUrls

    const channel = createChannel(dapiUrl);

    this.client = createClient(
      PlatformDefinition,
      channel,
    );

    this.utils = {
      getStatus: getStatus.bind(this)
    }

    /*
    * const options = { network: 'testnet', nodeUrl: 'https://seed-1.pshenmic.dev' }
    * const sdk = new DashPlatformSDK()
    *
    * const identity = await sdk.identities.getByIdentifier('HVfqSPfdmiHsrajx7EmErGnV597uYdH3JGhvwpVDcdAT')
    * const identity = await sdk.identities.getByPublicKeyHash('b381c47c9b164ace0c5a525afab443a9fe636f3c')
    * const identity = await sdk.identities.getByName('pshenmic.dash')
    *
    * const identityContractNonce = await sdk.identities.getIdentityContractNonce(identity, dataContract)
    *
    * const document = await sdk.documents.create(identity, documentType, {key: 'value'}, identityContractNonce)
    * const [document] = await sdk.documents.get(dataContract, query)
    *
    * const stateTransition = await sdk.stateTransition.fromDocument(document)
    *
    * const [identityPublicKey] = sdk.identities.getIdentityPublicKeys()
    *
    * await stateTransition.sign(identityPublicKey)
    *
    * console.log(stateTransition.hash().toString('hex'), stateTransition.toBuffer().toString('hex')
    *
    * await sdk.stateTransition.broadcast(stateTransition)
    *
    *
    * */
  }
}


// load identity
// get identity by identifier
// getIdentityKeys
// getIdentityByPublicKeyHash
// create document (6 STs)
// getDocuments
// getIdentityNonce
// getIdentityContractNonce
// broadcastStateTransition
// get data contract
