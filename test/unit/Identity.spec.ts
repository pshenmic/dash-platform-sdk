import { DocumentWASM, IdentityPublicKeyWASM, IdentityWASM } from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src/DashPlatformSDK'

let sdk: DashPlatformSDK

describe('Identity', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet', dapiUrl: 'https://54.201.32.131:1443' })
  })

  test('should be able to search names by DPNS name', async () => {
    const document = await sdk.names.search('xyz.dash')

    expect(document).toEqual(expect.any(DocumentWASM))
  })

  test('should be able to get identity by identifier', async () => {
    const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

    const identity = await sdk.identities.getIdentityByIdentifier(identifier)

    expect(identity).toEqual(expect.any(IdentityWASM))
  })

  test('should be able to get identity by public key hash', async () => {
    const publicKeyHash = 'c1b95d254c405a3d9d82ef88a47f9f792ac8efd7'

    const identity = await sdk.identities.getIdentityByPublicKeyHash(publicKeyHash)

    expect(identity).toEqual(expect.any(IdentityWASM))
  })

  test('should be able to get identity by non unique public key hash', async () => {
    const identity = await sdk.identities.getIdentityByNonUniquePublicKeyHash('8b30a2cda275d1110874c0380b8447db3a9b04ee')

    expect(identity).toEqual(expect.any(IdentityWASM))
  })

  test('should be able to get identity contract nonce', async () => {
    const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'
    const dataContract = 'DrEhmVJz56ukHbaFt8xLVRasnNWsrx3x8dGtcu9xg6rV'

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
