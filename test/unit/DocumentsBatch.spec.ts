import { DashPlatformSDK } from '../../src'
import {
  DocumentCreateTransitionWASM,
  DocumentDeleteTransitionWASM,
  DocumentPurchaseTransitionWASM, DocumentReplaceTransitionWASM,
  DocumentsBatchWASM, DocumentTransferTransitionWASM, DocumentUpdatePriceTransitionWASM, StateTransitionWASM
} from 'pshenmic-dpp'
import {create} from "dashhd";

let sdk: DashPlatformSDK

let dataContract: string
let identity: string
let recipient: string
let identityContractNonce: bigint
let documentType: string
let data: object
let price: bigint

describe('DocumentsBatch', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()

    dataContract = '6QMfQTdKpC3Y9uWBcTwXeY3KdzRLDqASUsDnQ4MEc9XC'
    identity = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'
    recipient = 'B8kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'
    identityContractNonce = BigInt(1)
    price = BigInt(11)
    documentType = 'pool'
    data = {
      name: 'MyPool',
      type: 'EVONODE',
      status: 'INACTIVE',
      description: 'test pool'
    }
  })

  test('should be able to create document batch from document create transition', async () => {

    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transition = new sdk.wasm.DocumentCreateTransitionWASM(document, identityContractNonce, document.getDocumentTypeName())

    const batch = await sdk.stateTransitions.documentsBatch.create(transition, identity)

    expect(transition).toEqual(expect.any(DocumentCreateTransitionWASM))
    expect(batch).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create document batch from document delete transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transition = new sdk.wasm.DocumentDeleteTransitionWASM(document, identityContractNonce, document.getDocumentTypeName())

    const batch = await sdk.stateTransitions.documentsBatch.create(transition, identity)

    expect(transition).toEqual(expect.any(DocumentDeleteTransitionWASM))
    expect(batch).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create document batch from document purchase transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transition = new sdk.wasm.DocumentPurchaseTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), price)

    const batch = await sdk.stateTransitions.documentsBatch.create(document, identity)

    expect(transition).toEqual(expect.any(DocumentPurchaseTransitionWASM))
    expect(batch).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create document batch from document replace transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transition = new sdk.wasm.DocumentReplaceTransitionWASM(document, identityContractNonce, document.getDocumentTypeName())

    const batch = await sdk.stateTransitions.documentsBatch.create(transition, identity)

    expect(transition).toEqual(expect.any(DocumentReplaceTransitionWASM))
    expect(batch).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create document batch from document transfer transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transition = new sdk.wasm.DocumentTransferTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), recipient)

    const batch = await sdk.stateTransitions.documentsBatch.create(transition, identity)

    expect(transition).toEqual(expect.any(DocumentTransferTransitionWASM))
    expect(batch).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create document batch from document update price transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transition = new sdk.wasm.DocumentUpdatePriceTransitionWASM(document, identityContractNonce, document.getDocumentTypeName(), price)

    const batch = await sdk.stateTransitions.documentsBatch.create(transition, identity)

    expect(transition).toEqual(expect.any(DocumentUpdatePriceTransitionWASM))
    expect(batch).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create document batch from document', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const batch = await sdk.stateTransitions.documentsBatch.create(document, identity, { identityContractNonce: BigInt(1) })

    expect(batch).toEqual(expect.any(StateTransitionWASM))
  })
})
