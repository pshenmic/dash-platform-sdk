import status from './node/status'
import getDocuments from './documents/get'
import createDocument from './documents/create'
import getDataContractByIdentifier from './dataContracts/getByIdentifier'
import getIdentityByIdentifier from './identities/getByIdentifier'
import getByPublicKeyHash from './identities/getByPublicKeyHash'
import * as wasm from 'pshenmic-dpp'
import wasmBytes from 'pshenmic-dpp/dist/wasm/pshenmic_dpp_bg'
import getIdentityContractNonce from './identities/getIdentityContractNonce'
import getIdentityNonce from './identities/getIdentityNonce'
import getIdentityPublicKeys from './identities/getIdentityPublicKeys'
import search from './names/search'
import GRPCConnectionPool from './grpcConnectionPool'
import fromDocument from './stateTransitions/fromDocument'
import broadcastStateTransition from './stateTransitions/broadcast'
import waitForStateTransitionResult from './stateTransitions/waitForStateTransitionResult'

const DEFAULT_OPTIONS = {
  network: 'testnet'
}

export default class DashPlatformSDK {
  constructor (options = DEFAULT_OPTIONS) {
    wasm.initSync({ module: Buffer.from(wasmBytes, 'base64') })

    this.network = options.network

    this.grpcPool = new GRPCConnectionPool(this.network)

    this.wasm = wasm

    this.dataContracts = {
      getByIdentifier: getDataContractByIdentifier.bind(this)
    }

    this.documents = {
      query: getDocuments.bind(this),
      create: createDocument.bind(this)
    }

    this.names = {
      search: search.bind(this)
    }

    this.stateTransitions = {
      fromDocument: fromDocument.bind(this),
      broadcast: broadcastStateTransition.bind(this),
      waitForStateTransitionResult: waitForStateTransitionResult.bind(this),
    }

    this.identities = {
      getByIdentifier: getIdentityByIdentifier.bind(this),
      getByPublicKeyHash: getByPublicKeyHash.bind(this),
      getIdentityContractNonce: getIdentityContractNonce.bind(this),
      getIdentityNonce: getIdentityNonce.bind(this),
      getIdentityPublicKeys: getIdentityPublicKeys.bind(this)
    }

    this.node = {
      status: status.bind(this)
    }
  }
}
