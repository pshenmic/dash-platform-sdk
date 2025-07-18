import {
  DataContractWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { DashPlatformSDK, DataContractConfig } from '../../src/types'

let sdk: DashPlatformSDK

let ownerIdentifier: string
let identityNonce: bigint
let config: DataContractConfig
let schema: object

describe('DataContract', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()

    ownerIdentifier = 'GARSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
    identityNonce = BigInt(11)

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
    let dataContract

    // System Data Contract
    dataContract = await sdk.dataContracts.getDataContractByIdentifier('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')

    // User Data Contract
    dataContract = await sdk.dataContracts.getDataContractByIdentifier('Aukz296s36am6wKStoMbxm4YhC6kTpu3mERVrC7vHokP')

    // User Data Contract with keep history
    dataContract = await sdk.dataContracts.getDataContractByIdentifier('DrEhmVJz56ukHbaFt8xLVRasnNWsrx3x8dGtcu9xg6rV')

    expect(dataContract).toEqual(expect.any(DataContractWASM))
  })

  test('should be able to create data contract', async () => {
    const dataContract = sdk.dataContracts.create(ownerIdentifier, identityNonce, schema)

    expect(dataContract).toEqual(expect.any(DataContractWASM))
  })

  test('should be able to create data contract with optional params', async () => {
    const dataContract = sdk.dataContracts.create(
      ownerIdentifier,
      identityNonce,
      schema,
      true,
      undefined,
      config
    )

    expect(dataContract).toEqual(expect.any(DataContractWASM))
    expect(dataContract.getConfig()).toEqual(config)
  })

  test('should be able to create data contract create transition', async () => {
    const dataContract = sdk.dataContracts.create(ownerIdentifier, identityNonce, schema)

    const transition = sdk.dataContracts.createStateTransition(dataContract, 'create', identityNonce)

    expect(transition).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create data contract update transition', async () => {
    const dataContract = sdk.dataContracts.create(ownerIdentifier, identityNonce, schema)

    const transition = sdk.dataContracts.createStateTransition(dataContract, 'update', identityNonce)

    expect(transition).toEqual(expect.any(StateTransitionWASM))
  })
})
