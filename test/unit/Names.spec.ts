import broadcast from '../../src/stateTransitions/broadcast'

import { DocumentWASM, PrivateKeyWASM } from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src/DashPlatformSDK'
import sleep from '../../src/utils/sleep'
jest.mock('../../src/stateTransitions/broadcast')
jest.mock('../../src/utils/sleep')

let sdk: DashPlatformSDK

describe('DPNS names', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet' })

    // @ts-expect-error
    sleep.mockReturnValue(Promise.resolve())

    sdk.stateTransitions.broadcast = jest.fn()
  })

  test('should be able to search names by identity identifier', async () => {
    const documents = await sdk.names.searchByName('xyz.dash')

    expect(documents?.length).toEqual(1)
    expect(documents[0]).toEqual(expect.any(DocumentWASM))
  })

  test('should be able to search names by DPNS name', async () => {
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
})
