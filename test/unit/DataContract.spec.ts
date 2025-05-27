import { DashPlatformSDK } from '../../src/index'
import { DataContractWASM, PlatformVersionWASM } from 'pshenmic-dpp'

let sdk: DashPlatformSDK

let dataContractIdentifier: string
let ownerIdentifier: string
let identityNonce: bigint
let schema: object
let definitions: object

describe('DataContract', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()

    dataContractIdentifier = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
    ownerIdentifier = 'GARSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
    identityNonce = BigInt(11)

    definitions = {
      def1: true
    }
    schema = {
      note: {
        type: 'object',
        properties: {
          author: {
            type: 'string',
            position: 1
          },
          message: {
            type: 'string',
            position: 0
          }
        },
        additionalProperties: false
      }
    }
  })

  test('should be able to get data contract', async () => {
    const dataContract = await sdk.dataContracts.getByIdentifier(dataContractIdentifier)

    expect(dataContract).toEqual(expect.any(DataContractWASM))
  })

  test('should be able to create data contract', async () => {
    const dataContract = await sdk.dataContracts.create(ownerIdentifier, identityNonce, schema)

    expect(dataContract).toEqual(expect.any(DataContractWASM))
  })

  test('should be able to create data contract with optional params', async () => {
    const dataContract = await sdk.dataContracts.create(
      ownerIdentifier,
      identityNonce,
      schema,
      definitions,
      true,
      PlatformVersionWASM.PLATFORM_V2)

    expect(dataContract).toEqual(expect.any(DataContractWASM))
  })
})
