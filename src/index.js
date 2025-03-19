import {
  PlatformDefinition,
} from '../proto/generated/platform.js';
import {createChannel, createClient} from 'nice-grpc-web';
import status from './node/status'
import getDocuments from './documents/get'
import createDocument from './documents/create'
import getDataContractByIdentifier from './dataContracts/getByIdentifier'
import getIdentityByIdentifier from './identities/getByIdentifier'
import getByPublicKeyHash from './identities/getByPublicKeyHash'
import * as wasm from 'pshenmic-dpp'
import wasmBytes from "pshenmic-dpp/dist/wasm/pshenmic_dpp_bg"
import getIdentityContractNonce from './identities/getIdentityContractNonce'
import getIdentityNonce from './identities/getIdentityNonce'
import getIdentityPublicKeys from './identities/getIdentityPublicKeys'
import search from './identities/search'
import { PrivateKeyWASM } from 'pshenmic-dpp'

const DEFAULT_OPTIONS = {
  network: 'testnet',
  dapiUrls: ['https://52.33.28.47:1443'],
}

export default class DashPlatformSDK {
  constructor (options = DEFAULT_OPTIONS) {
    wasm.initSync({module: Buffer.from(wasmBytes, 'base64') })

    this.network = options.network;
    this.dapiUrls = options.dapiUrls

    const [dapiUrl] = this.dapiUrls

    const channel = createChannel(dapiUrl);

    this.wasm = wasm

    this.client = createClient(
      PlatformDefinition,
      channel,
    );

    this.dataContracts = {
      getByIdentifier: getDataContractByIdentifier.bind(this),
    }

    this.documents = {
      query: getDocuments.bind(this),
      create: createDocument.bind(this)
    }

    this.names = {
      search: search.bind(this),
    }

    this.identities = {
      getByIdentifier: getIdentityByIdentifier.bind(this),
      getByPublicKeyHash: getByPublicKeyHash.bind(this),
      getIdentityContractNonce: getIdentityContractNonce.bind(this),
      getIdentityNonce: getIdentityNonce.bind(this),
      getIdentityPublicKeys: getIdentityPublicKeys.bind(this),
    }

    this.node = {
      status: status.bind(this),
    }
  }
}
