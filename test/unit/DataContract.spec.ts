import {
  DataContractWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import {DashPlatformSDK, DataContractConfig } from '../../src/types'
import {DataContractTransitionType} from "../../src/dataContracts/createStateTransition";

let sdk: DashPlatformSDK

let dataContractIdentifier: string
let ownerIdentifier: string
let identityNonce: bigint
let config: DataContractConfig
let schema: object

describe('DataContract', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()

    dataContractIdentifier = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
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
    const dataContract = await sdk.dataContracts.getDataContractByIdentifier(dataContractIdentifier)

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

    const transition = sdk.dataContracts.createStateTransition(dataContract, DataContractTransitionType.Create, identityNonce)

    expect(transition).toEqual(expect.any(StateTransitionWASM))
  })

  test('should be able to create data contract update transition', async () => {
    const dataContract = sdk.dataContracts.create(ownerIdentifier, identityNonce, schema)

    const transition = sdk.dataContracts.createStateTransition(dataContract, DataContractTransitionType.Update, identityNonce)

    expect(transition).toEqual(expect.any(StateTransitionWASM))
  })
})
