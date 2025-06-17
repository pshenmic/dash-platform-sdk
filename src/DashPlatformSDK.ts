import status from './node/status'
import getDocuments from './documents/get'
import createDocument from './documents/create'
import getDataContractByIdentifier from './dataContracts/getByIdentifier'
import getIdentityByIdentifier from './identities/getByIdentifier'
import getByPublicKeyHash from './identities/getByPublicKeyHash'
import * as dpp from 'pshenmic-dpp'
import dppWasmBytes from 'pshenmic-dpp/dist/wasm/pshenmic_dpp_bg'
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
import createDataContractTransition from './stateTransitions/dataContract/createDataContractTransition'
import updateDataContractTransition from './stateTransitions/dataContract/updateDataContractTransition'
import createDataContract from './dataContracts/create'
import documentCreateTransition from './stateTransitions/batch/document/create'
import documentReplaceTransition from './stateTransitions/batch/document/replace'
import documentDeleteTransition from './stateTransitions/batch/document/delete'
import documentPurchaseTransition from './stateTransitions/batch/document/purchase'
import documentUpdatePriceTransition from './stateTransitions/batch/document/updatePrice'
import documentTransferTransition from './stateTransitions/batch/document/transfer'

const DEFAULT_OPTIONS: { network: 'testnet' | 'mainnet', dapiUrl?: string } = {
  network: 'testnet',
  dapiUrl: undefined
}

export default class DashPlatformSDK {
  constructor (options: { network: 'testnet' | 'mainnet', dapiUrl?: string } = DEFAULT_OPTIONS) {
    const uint8array = base64.parse(dppWasmBytes.replaceAll(' ', ''))
    dpp.initSync({ module: uint8array })

    this.network = options.network

    this.grpcPool = new GRPCConnectionPool(this.network, options.dapiUrl)

    this.dpp = dpp
  }

  network: 'testnet' | 'mainnet'
  grpcPool: GRPCConnectionPool
  dpp: DashPlatformProtocolWASM

  dataContracts: DataContractsController = {
    create: createDataContract.bind(this),
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
    waitForStateTransitionResult: waitForStateTransitionResult.bind(this),
    dataContract: {
      create: createDataContractTransition.bind(this),
      update: updateDataContractTransition.bind(this)
    },
    documentsBatch: {
      create: documentCreateTransition.bind(this),
      delete: documentDeleteTransition.bind(this),
      purchase: documentPurchaseTransition.bind(this),
      replace: documentReplaceTransition.bind(this),
      transfer: documentTransferTransition.bind(this),
      updatePrice: documentUpdatePriceTransition.bind(this)
    }
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
