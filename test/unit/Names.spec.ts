import broadcast from '../../src/stateTransitions/broadcast.js'
import waitForStateTransitionResult from '../../src/stateTransitions/waitForStateTransitionResult.js'

import { DocumentWASM, PrivateKeyWASM } from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'
import sleep from '../../src/utils/sleep.js'
jest.mock('../../src/stateTransitions/waitForStateTransitionResult')
jest.mock('../../src/stateTransitions/broadcast')
jest.mock('../../src/utils/sleep')

let sdk: DashPlatformSDK

describe('DPNS names', () => {
  beforeAll(async () => {
    sdk = new DashPlatformSDK({ network: 'testnet' })

    // @ts-expect-error
    sleep.mockReturnValue(Promise.resolve())

    sdk.stateTransitions.broadcast = jest.fn()
    sdk.stateTransitions.waitForStateTransitionResult = jest.fn()
  })

  test('should be able to search names by DPNS name', async () => {
    const documents = await sdk.names.searchByName('xyz.dash')

    expect(documents?.length).toEqual(1)
    expect(documents[0]).toEqual(expect.any(DocumentWASM))
  })

  test('should be able to search names by identity', async () => {
    const documents = await sdk.names.searchByIdentity('36LGwPSXef8q8wpdnx4EdDeVNuqCYNAE9boDu5bxytsm')

    expect(documents?.length).toEqual(3)

    const [xyzDocument] = documents

    expect(xyzDocument.ownerId.base58()).toEqual('36LGwPSXef8q8wpdnx4EdDeVNuqCYNAE9boDu5bxytsm')
  })

  test('should be able to register a name', async () => {
    const fullName = 'test-identity-050.dash'

    const identityId = 'CKKYnVeKoxCbvuEhiT6MDoQaRyXgDECwtxoKL5cqucZE'
    const privateKey = PrivateKeyWASM.fromWIF('XERm528aQWJ3hzEcb79KMQKewbSSJQtni3fWHbu75wDxg6xg6AA3')

    await sdk.names.registerName(fullName, identityId, privateKey)

    expect(broadcast).toHaveBeenCalledTimes(2)
  })

  test('should be able to register a name with existing preorder salt', async () => {
    const fullName = 'test-identity-050.dash'

    const identityId = 'CKKYnVeKoxCbvuEhiT6MDoQaRyXgDECwtxoKL5cqucZE'
    const privateKey = PrivateKeyWASM.fromWIF('XERm528aQWJ3hzEcb79KMQKewbSSJQtni3fWHbu75wDxg6xg6AA3')
    const preorderSalt = new Uint8Array(32).fill(1)

    jest.mocked(broadcast).mockClear()

    const salt = await sdk.names.registerName(fullName, identityId, privateKey, preorderSalt)

    expect(salt).toEqual(preorderSalt)
    expect(broadcast).toHaveBeenCalledTimes(1)
  })

  test('should expose preorder salt in error if preorder confirmation fails', async () => {
    const fullName = 'test-identity-050.dash'

    const identityId = 'CKKYnVeKoxCbvuEhiT6MDoQaRyXgDECwtxoKL5cqucZE'
    const privateKey = PrivateKeyWASM.fromWIF('XERm528aQWJ3hzEcb79KMQKewbSSJQtni3fWHbu75wDxg6xg6AA3')

    jest.mocked(waitForStateTransitionResult).mockRejectedValueOnce(new Error('Timeout'))

    const error = await sdk.names.registerName(fullName, identityId, privateKey).catch(e => e)

    expect(error.message).toEqual('Timeout')
    expect(error.preorderSalt).toBeInstanceOf(Uint8Array)
    expect(error.preorderSalt.length).toEqual(32)
  })

  test('should not expose preorder salt in error if preorder broadcast is refused', async () => {
    const fullName = 'test-identity-050.dash'

    const identityId = 'CKKYnVeKoxCbvuEhiT6MDoQaRyXgDECwtxoKL5cqucZE'
    const privateKey = PrivateKeyWASM.fromWIF('XERm528aQWJ3hzEcb79KMQKewbSSJQtni3fWHbu75wDxg6xg6AA3')

    jest.mocked(broadcast).mockRejectedValueOnce(new Error('Refused'))

    const error = await sdk.names.registerName(fullName, identityId, privateKey).catch(e => e)

    expect(error.message).toEqual('Refused')
    expect(error.preorderSalt).toBeUndefined()
  })
})
