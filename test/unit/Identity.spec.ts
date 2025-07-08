import { DocumentWASM, IdentityPublicKeyWASM, IdentityWASM } from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src'

let sdk: DashPlatformSDK

describe('Identity', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
  })

  test('should be able to search names by DPNS name', async () => {
    const [document] = await sdk.names.search('xyz.dash')

    expect(document).toEqual(expect.any(DocumentWASM))
  })

  test('should be able to get identity by identifier', async () => {
    const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

    const identity = await sdk.identities.getIdentityByIdentifier(identifier)

    expect(identity).toEqual(expect.any(IdentityWASM))
  })

  test('should be able to get identity by public key hash', async () => {
    const publicKeyHash = 'c5b7fdfa5731e1b31b1b42c13959756e8db22b3b'

    const identity = await sdk.identities.getIdentityByPublicKeyHash(publicKeyHash)

    expect(identity).toEqual(expect.any(IdentityWASM))
  })

  test('should be able to get identity contract nonce', async () => {
    const identifier = 'B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH'
    const dataContract = '6QMfQTdKpC3Y9uWBcTwXeY3KdzRLDqASUsDnQ4MEc9XC'

    const identityContractNonce = await sdk.identities.getIdentityContractNonce(identifier, dataContract)

    expect(identityContractNonce).toEqual(expect.any(BigInt))
  })

  test('should be able to get identity nonce', async () => {
    const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

    const identityNonce = await sdk.identities.getIdentityNonce(identifier)

    expect(identityNonce).toEqual(expect.any(BigInt))
  })

  test('should be able to get identity public keys', async () => {
    const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

    const identityPublicKeys = await sdk.identities.getIdentityPublicKeys(identifier)

    expect(identityPublicKeys.every(identityPublicKey => identityPublicKey instanceof IdentityPublicKeyWASM)).toBeTruthy()
  })

  test('should be able to get balance', async () => {
    const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

    const balance = await sdk.identities.getIdentityBalance(identifier)

    expect(balance).toEqual(expect.any(BigInt))
  })
})
