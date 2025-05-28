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
import mnemonicToSeed from './keyPairs/mnemonicToSeed'
import seedToWallet from './keyPairs/seedToWallet'
import {
  DataContractsController, DocumentsBatchController,
  DocumentsController,
  IdentitiesController, KeyPairs,
  NamesController,
  NodeController,
  StateTransitionsController,
  Utils
} from './types'
import { DashPlatformProtocolWASM } from 'pshenmic-dpp'
import keyToWalletId from './keyPairs/keyToWalletId'
import * as DashHD from 'dashhd'
import derivePath from './keyPairs/derivePath'
import deriveChild from './keyPairs/deriveChild'
import keyToPublicKey from './keyPairs/keyToPublicKey'
import xkeyToHDXKey from './keyPairs/xkeyToHDXKey'
import publicKeyToAddress from './keyPairs/publicKeyToAddress'
import privateKeyToWif from './keyPairs/privateKeyToWif'
import keyToXPrivateKey from './keyPairs/keyToXPrivateKey'
import keyToXPublicKey from './keyPairs/keyToXPublicKey'
import mnemonicToWallet from './keyPairs/mnemonicToWallet'
import walletToIdentityKey from './keyPairs/walletToIdentityKey'
import mnemonicToIdentityKey from './keyPairs/mnemonicToIdentityKey'
import createDataContract from './dataContracts/create'
import createDataContractTransition from './dataContracts/transitions/createDataContractTransition'
import updateDataContractTransition from './dataContracts/transitions/updateDataContractTransition'
import { createBatch } from './documents/documentsBatch/createBatch'
import createDocumentCreateTransition from './documents/transitions/createDocumentCreateTransition'
import createDocumentDeleteTransition from './documents/transitions/createDocumentDeleteTransition'
import createDocumentPurchaseTransition from './documents/transitions/createDocumentPurchaseTransition'
import createDocumentReplaceTransition from './documents/transitions/createDocumentReplaceTransition'
import createDocumentUpdatePriceTransition from './documents/transitions/createDocumentUpdatePriceTransition'
import createDocumentTransferTransition from './documents/transitions/createDocumentTransferTransition'

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
    transitions: {
      createTransition: createDataContractTransition.bind(this),
      updateTransition: updateDataContractTransition.bind(this)
    },
    create: createDataContract.bind(this),
    getByIdentifier: getDataContractByIdentifier.bind(this)
  }

  documents: DocumentsController = {
    query: getDocuments.bind(this),
    create: createDocument.bind(this)
  }

  documentsBatch: DocumentsBatchController = {
    create: createBatch.bind(this),
    transitions: {
      documentCreateTransition: {
        create: createDocumentCreateTransition.bind(this)
      },
      documentDeleteTransition: {
        create: createDocumentDeleteTransition.bind(this)
      },
      documentPurchaseTransition: {
        create: createDocumentPurchaseTransition.bind(this)
      },
      documentReplaceTransition: {
        create: createDocumentReplaceTransition.bind(this)
      },
      documentUpdatePriceTransition: {
        create: createDocumentUpdatePriceTransition.bind(this)
      },
      documentTransferTransition: {
        create: createDocumentTransferTransition.bind(this)
      }
    }
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

  keyPairs: KeyPairs = {
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
