import { DocumentWASM, StateTransitionWASM } from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src/DashPlatformSDK'

let sdk: DashPlatformSDK
let dataContract: string
let identity: string
let documentType: string
let revision: bigint
let data: object

describe('Document', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
    dataContract = '6QMfQTdKpC3Y9uWBcTwXeY3KdzRLDqASUsDnQ4MEc9XC'
    identity = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'
    revision = BigInt(1)
    documentType = 'pool'
    data = {
      name: 'MyPool',
      type: 'EVONODE',
      status: 'INACTIVE',
      description: 'test pool'
    }
  })

  test('should be able to create document', async () => {
    const document = sdk.documents.create(dataContract, documentType, data, identity, revision)

    expect(document).toEqual(expect.any(DocumentWASM))
  })

  test('should be able to get documents', async () => {
    const dataContract = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
    const documentType = 'domain'

    const [document] = await sdk.documents.query(dataContract, documentType)

    expect(document.createdAtBlockHeight).toEqual(undefined)

    expect(document.dataContractId.base58()).toEqual(dataContract)
    expect(document).toEqual(expect.any(DocumentWASM))
  })

  test('should be able to get document', async () => {
    const dataContract = '6hVQW16jyvZyGSQk2YVty4ND6bgFXozizYWnPt753uW5'
    const documentType = 'torrent'
    const limit = 100

    // @ts-expect-error
    const [document] = await sdk.documents.query(dataContract, documentType, null, null, limit)

    expect(document.createdAtBlockHeight).toEqual(undefined)

    expect(document.dataContractId.base58()).toEqual(dataContract)
    expect(document).toEqual(expect.any(DocumentWASM))
  })

  describe('should be able to create state transition', () => {
    test('should be able to create a create transition', async () => {
      const document = sdk.documents.create(dataContract, documentType, data, identity)
      const identityContractNonce = BigInt(1)

      const stateTransition = sdk.documents.createStateTransition(document, 'create', { identityContractNonce })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should be able to create a replace transition', async () => {
      const document = sdk.documents.create(dataContract, documentType, data, identity, revision + BigInt(1))
      const identityContractNonce = BigInt(1)

      const stateTransition = sdk.documents.createStateTransition(document, 'replace', { identityContractNonce })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should be able to create a delete transition', async () => {
      const document = sdk.documents.create(dataContract, documentType, data, identity, revision + BigInt(1))
      const identityContractNonce = BigInt(1)

      const stateTransition = sdk.documents.createStateTransition(document, 'delete', { identityContractNonce })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should be able to create a transfer transition', async () => {
      const document = sdk.documents.create(dataContract, documentType, data, identity, revision + BigInt(1))
      const identityContractNonce = BigInt(1)
      const recipientId = '6hVQW16jyvZyGSQk2YVty4ND6bgFXozizYWnPt753uW5'

      const stateTransition = sdk.documents.createStateTransition(document, 'transfer', { identityContractNonce, recipientId })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should be able to create a updatePrice transition', async () => {
      const document = sdk.documents.create(dataContract, documentType, data, identity, revision + BigInt(1))
      const identityContractNonce = BigInt(1)
      const price = BigInt(10000000)

      const stateTransition = sdk.documents.createStateTransition(document, 'updatePrice', { identityContractNonce, price })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should be able to create a purchase transition', async () => {
      const document = sdk.documents.create(dataContract, documentType, data, identity, revision + BigInt(1))
      const identityContractNonce = BigInt(1)
      const amount = BigInt(10000000)

      const stateTransition = sdk.documents.createStateTransition(document, 'purchase', { identityContractNonce, amount })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })
  })
})
