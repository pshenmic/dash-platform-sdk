import {DashPlatformSDK} from "../../src";
import {
  DocumentCreateTransitionWASM,
  DocumentDeleteTransitionWASM,
  DocumentPurchaseTransitionWASM, DocumentReplaceTransitionWASM,
  DocumentsBatchWASM, DocumentTransferTransitionWASM, DocumentUpdatePriceTransitionWASM
} from "pshenmic-dpp";

let sdk: DashPlatformSDK

let dataContract: string
let identity: string
let recipient: string
let identityContractNonce: bigint
let documentType: string
let data: object
let price: bigint

describe("DocumentsBatch", () => {
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

    const transition = await sdk.documentsBatch.transitions.documentCreateTransition.create(document, identityContractNonce)

    const batch = await sdk.documentsBatch.create(transition, identity)

    const batchFromArray = await sdk.documentsBatch.create([transition, transition], identity)

    expect(transition).toEqual(expect.any(DocumentCreateTransitionWASM))
    expect(batch).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray.transitions.length).toEqual(2)
  })

  test('should be able to create document batch from document delete transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transition = await sdk.documentsBatch.transitions.documentDeleteTransition.create(document, identityContractNonce)

    const batch = await sdk.documentsBatch.create(transition, identity)

    const batchFromArray = await sdk.documentsBatch.create([transition, transition], identity)

    expect(transition).toEqual(expect.any(DocumentDeleteTransitionWASM))
    expect(batch).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray.transitions.length).toEqual(2)
  })

  test('should be able to create document batch from document purchase transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transition = await sdk.documentsBatch.transitions.documentPurchaseTransition.create(document, identityContractNonce, price)

    const batch = await sdk.documentsBatch.create(transition, identity)

    const batchFromArray = await sdk.documentsBatch.create([transition, transition], identity)

    expect(transition).toEqual(expect.any(DocumentPurchaseTransitionWASM))
    expect(batch).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray.transitions.length).toEqual(2)
  })

  test('should be able to create document batch from document replace transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transition = await sdk.documentsBatch.transitions.documentReplaceTransition.create(document, identityContractNonce)

    const batch = await sdk.documentsBatch.create(transition, identity)

    const batchFromArray = await sdk.documentsBatch.create([transition, transition], identity)

    expect(transition).toEqual(expect.any(DocumentReplaceTransitionWASM))
    expect(batch).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray.transitions.length).toEqual(2)
  })

  test('should be able to create document batch from document transfer transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transition = await sdk.documentsBatch.transitions.documentTransferTransition.create(document, identityContractNonce, recipient)

    const batch = await sdk.documentsBatch.create(transition, identity)

    const batchFromArray = await sdk.documentsBatch.create([transition, transition], identity)

    expect(transition).toEqual(expect.any(DocumentTransferTransitionWASM))
    expect(batch).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray.transitions.length).toEqual(2)
  })

  test('should be able to create document batch from document update price transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transition = await sdk.documentsBatch.transitions.documentUpdatePriceTransition.create(document, identityContractNonce, price)

    const batch = await sdk.documentsBatch.create(transition, identity)

    const batchFromArray = await sdk.documentsBatch.create([transition, transition], identity)

    expect(transition).toEqual(expect.any(DocumentUpdatePriceTransitionWASM))
    expect(batch).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray.transitions.length).toEqual(2)
  })

  test('should be able to create document batch from document', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const batch = await sdk.documentsBatch.create(document, identity, {identityContractNonce: BigInt(1)})

    const batchFromArray = await sdk.documentsBatch.create([document, document], identity, {identityContractNonce: BigInt(1)})

    expect(batch).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray).toEqual(expect.any(DocumentsBatchWASM))
    expect(batchFromArray.transitions.length).toEqual(2)
  })

  test('should be able to create document batch from mixed input', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identityContractNonce, identity)

    const transitionCreate = await sdk.documentsBatch.transitions.documentCreateTransition.create(document, identityContractNonce)
    const transitionDelete = await sdk.documentsBatch.transitions.documentDeleteTransition.create(document, identityContractNonce)
    const transitionPurchase = await sdk.documentsBatch.transitions.documentPurchaseTransition.create(document, identityContractNonce, price)
    const transitionReplace = await sdk.documentsBatch.transitions.documentReplaceTransition.create(document, identityContractNonce)
    const transitionTransfer = await sdk.documentsBatch.transitions.documentTransferTransition.create(document, identityContractNonce, recipient)
    const transitionUpdatePrice = await sdk.documentsBatch.transitions.documentUpdatePriceTransition.create(document, identityContractNonce, price)

    const batch = await sdk.documentsBatch.create([document, transitionCreate, transitionDelete, transitionPurchase, transitionReplace, transitionTransfer, transitionUpdatePrice], identity, {identityContractNonce: BigInt(1)})

    expect(batch).toEqual(expect.any(DocumentsBatchWASM))
    expect(batch.transitions.length).toEqual(7)
  })
})