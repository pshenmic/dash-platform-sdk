import {
  BatchType,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src/DashPlatformSDK'

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
    identity = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'
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
    const document = await sdk.documents.create(dataContract, documentType, data, identity, BigInt(1))

    const stateTransitions = await sdk.documents.createStateTransition(document, BatchType.Create, identityContractNonce)

    expect(stateTransitions).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create document batch from document delete transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identity, BigInt(1))

    const stateTransitions = await sdk.documents.createStateTransition(document, BatchType.Delete, identityContractNonce)

    expect(stateTransitions).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create document batch from document purchase transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identity, BigInt(1))

    const stateTransition = await sdk.documents.createStateTransition(document, BatchType.Purchase, identityContractNonce, { price })

    expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create document batch from document replace transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identity, BigInt(1))

    const stateTransition = await sdk.documents.createStateTransition(document, BatchType.Replace, identityContractNonce)

    expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create document batch from document transfer transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identity, BigInt(1))

    const stateTransition = await sdk.documents.createStateTransition(document, BatchType.Transfer, identityContractNonce, { recipient })

    expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create document batch from document update price transition', async () => {
    const document = await sdk.documents.create(dataContract, documentType, data, identity, BigInt(1))

    const stateTransition = await sdk.documents.createStateTransition(document, BatchType.UpdatePrice, identityContractNonce, { price })

    expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
  })
})
