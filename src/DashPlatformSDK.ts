import {DashPlatformProtocolWASM} from 'pshenmic-dpp'
import GRPCConnectionPool from './grpcConnectionPool'
import {IdentitiesController} from "./identities";
import {StateTransitionsController} from "./stateTransitions/StateTransitionsController";
import {DocumentsController} from "./documents";
import {UtilsController} from "./utils";
import {KeyPairController} from "./keyPair";
import {NodeController} from "./node";
import {NamesController} from "./names";
import {DataContractsController} from "./dataContracts";

const DEFAULT_OPTIONS: { network: 'testnet' | 'mainnet', dapiUrl?: string } = {
  network: 'testnet',
  dapiUrl: undefined
}

export default class DashPlatformSDK {
  utils: UtilsController
  identities: IdentitiesController
  documents: DocumentsController
  stateTransitions: StateTransitionsController
  keyPair: KeyPairController
  node: NodeController
  dataContracts: DataContractsController
  names: NamesController

  constructor (options: { network: 'testnet' | 'mainnet', dapiUrl?: string } = DEFAULT_OPTIONS) {
    this.network = options.network

    this.identities = new IdentitiesController()
    this.documents = new DocumentsController()
    this.utils = new UtilsController()
    this.keyPair = new KeyPairController()
    this.node = new NodeController()
    this.dataContracts = new DataContractsController()
    this.names = new NamesController()

    this.grpcPool = new GRPCConnectionPool(this.network, options.dapiUrl)
  }

  network: 'testnet' | 'mainnet'
  grpcPool: GRPCConnectionPool
  dpp: DashPlatformProtocolWASM

}
