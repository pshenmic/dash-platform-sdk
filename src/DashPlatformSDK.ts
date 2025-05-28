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
import { base64 } from 'rfc4648'
import hexToBytes from './utils/hexToBytes'
import base58ToUint8Array from './utils/base58ToUint8Array'
import convertToHomographSafeChars from './utils/convertToHomographSafeChars'
import uint8ArrayToBase58 from './utils/uint8ArrayToBase58'
import getBalance from './identities/getBalance'
import bytesToHex from './utils/bytesToHex'
import mnemonicToSeed from './keyPair/mnemonicToSeed'
import seedToWallet from './keyPair/seedToWallet'
import {
  DataContractsController,
  DocumentsController,
  IdentitiesController, KeyPair,
  NamesController,
  NodeController,
  StateTransitionsController,
  Utils
} from './types'
import { DashPlatformProtocolWASM } from 'pshenmic-dpp'
import keyToWalletId from './keyPair/keyToWalletId'
import * as DashHD from 'dashhd'
import derivePath from './keyPair/derivePath'
import deriveChild from './keyPair/deriveChild'
import keyToPublicKey from './keyPair/keyToPublicKey'
import xkeyToHDXKey from './keyPair/xkeyToHDXKey'
import publicKeyToAddress from './keyPair/publicKeyToAddress'
import privateKeyToWif from './keyPair/privateKeyToWif'
import keyToXPrivateKey from './keyPair/keyToXPrivateKey'
import keyToXPublicKey from './keyPair/keyToXPublicKey'
import mnemonicToWallet from './keyPair/mnemonicToWallet'
import walletToIdentityKey from './keyPair/walletToIdentityKey'
import mnemonicToIdentityKey from './keyPair/mnemonicToIdentityKey'

const DEFAULT_OPTIONS: { network: 'testnet' | 'mainnet', dapiUrl?: string } = {
  network: 'testnet',
  dapiUrl: undefined
}

export default class DashPlatformSDK {
  constructor (options: { network: 'testnet' | 'mainnet', dapiUrl?: string } = DEFAULT_OPTIONS) {
    const uint8array = base64.parse(wasmBytes.replaceAll(' ', ''))
    wasm.initSync({ module: uint8array })

    this.network = options.network

    this.grpcPool = new GRPCConnectionPool(this.network, options.dapiUrl)

    this.wasm = wasm
  }

  network: 'testnet' | 'mainnet'
  grpcPool: GRPCConnectionPool
  wasm: DashPlatformProtocolWASM

  dataContracts: DataContractsController = {
    getByIdentifier: getDataContractByIdentifier.bind(this)
  }

  documents: DocumentsController = {
    query: getDocuments.bind(this),
    create: createDocument.bind(this)
  }

  names: NamesController = {
    search: search.bind(this)
  }

  stateTransitions: StateTransitionsController = {
    fromDocument: fromDocument.bind(this),
    broadcast: broadcastStateTransition.bind(this),
    waitForStateTransitionResult: waitForStateTransitionResult.bind(this)
  }

  identities: IdentitiesController = {
    getBalance: getBalance.bind(this),
    getByIdentifier: getIdentityByIdentifier.bind(this),
    getByPublicKeyHash: getByPublicKeyHash.bind(this),
    getIdentityContractNonce: getIdentityContractNonce.bind(this),
    getIdentityNonce: getIdentityNonce.bind(this),
    getIdentityPublicKeys: getIdentityPublicKeys.bind(this)
  }

  node: NodeController = {
    status: status.bind(this)
  }

  utils: Utils = {
    hexToBytes,
    bytesToHex,
    base58ToUint8Array,
    uint8ArrayToBase58,
    convertToHomographSafeChars
  }

  keyPair: KeyPair = {
    mnemonicToIdentityKey,
    utils: {
      ...DashHD._utils,
      mnemonicToSeed,
      seedToWallet,
      keyToWalletId,
      derivePath,
      deriveChild,
      keyToPublicKey,
      publicKeyToAddress,
      privateKeyToWif,
      keyToXPrivateKey,
      keyToXPublicKey,
      xkeyToHDXKey,
      mnemonicToWallet,
      walletToIdentityKey
    }
  }
}
