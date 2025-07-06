import { DocumentWASM } from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src'

let sdk: DashPlatformSDK

describe('Document', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
  })

  test('should be able to create document', async () => {
    const dataContract = '6QMfQTdKpC3Y9uWBcTwXeY3KdzRLDqASUsDnQ4MEc9XC'
    const identity = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'
    const revision = BigInt(1)
    const documentType = 'pool'
    const data = {
      name: 'MyPool',
      type: 'EVONODE',
      status: 'INACTIVE',
      description: 'test pool'
    }

    const document = await sdk.documents.create(dataContract, documentType, data, identity, revision)

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
})
