import { DashPlatformSDK } from '../../src/index'
import {
  DataContractWASM,
  PlatformVersionWASM, StateTransitionWASM
} from 'pshenmic-dpp'
import { DataContractConfig } from '../../src/types'

let sdk: DashPlatformSDK

let dataContractIdentifier: string
let ownerIdentifier: string
let identityNonce: bigint
let definitions: object
let config: DataContractConfig
let schema: object

describe('DataContract', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()

    dataContractIdentifier = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
    ownerIdentifier = 'GARSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
    identityNonce = BigInt(11)

    definitions = {
      def1: true
    }

    config = {
      $format_version: '0',
      canBeDeleted: true,
      readonly: true,
      keepsHistory: false,
      documentsKeepHistoryContractDefault: false,
      documentsMutableContractDefault: false,
      documentsCanBeDeletedContractDefault: true,
      requiresIdentityEncryptionBoundedKey: null,
      requiresIdentityDecryptionBoundedKey: null
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
      config,
      PlatformVersionWASM.PLATFORM_V2
    )

    expect(dataContract).toEqual(expect.any(DataContractWASM))
    expect(dataContract.getConfig()).toEqual(config)
  })

  test('should be able to create data contract create transition', async () => {
    const dataContract = await sdk.dataContracts.create(ownerIdentifier, identityNonce, schema)

    const transition = await sdk.stateTransitions.dataContract.create(dataContract, identityNonce)

    expect(transition).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create data contract update transition', async () => {
    const dataContract = await sdk.dataContracts.create(ownerIdentifier, identityNonce, schema)

    const transition = await sdk.stateTransitions.dataContract.update(dataContract, identityNonce)

    expect(transition).toEqual(expect.any(StateTransitionWASM))
  })
})
