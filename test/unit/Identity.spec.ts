import {
  DocumentWASM,
  IdentityPublicKeyWASM,
  IdentityWASM, KeyType,
  PrivateKeyWASM, Purpose, SecurityLevel
} from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src/DashPlatformSDK'
import { IdentityPublicKeyInCreation } from '../../src/types'
let sdk: DashPlatformSDK

describe('Identity', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
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

  describe('createStateTransition', () => {
    test('should be able to create IdentityCreateTransition via ChainLock', async () => {
      const assetLockPrivateKey = PrivateKeyWASM.fromHex('edd04a71bddb31e530f6c2314fd42ada333f6656bb853ece13f0577a8fd30612', 'testnet')
      const txid = '61aede830477254876d435a317241ad46753c4b1350dc991a45ebcf19ab80a11'
      const outputIndex = 0
      const coreChainLockedHeight = 1337

      const privateKey1 = PrivateKeyWASM.fromHex('a1286dd195e2b8e1f6bdc946c56a53e0c544750d6452ddc0f4c593ef311f21af', 'testnet')
      const identityPublicKeyInCreation1: IdentityPublicKeyInCreation = {
        id: 0,
        purpose: Purpose.AUTHENTICATION,
        securityLevel: SecurityLevel.MASTER,
        keyType: KeyType.ECDSA_SECP256K1,
        readOnly: false,
        data: privateKey1.getPublicKey().bytes()
      }

      const privateKey2 = PrivateKeyWASM.fromHex('44a8195e242364b935e9d7ff2106ed109e9baf3800907f5e58a259fdfd1ca5e5', 'testnet')
      const identityPublicKeyInCreation2: IdentityPublicKeyInCreation = {
        id: 1,
        purpose: Purpose.AUTHENTICATION,
        securityLevel: SecurityLevel.HIGH,
        keyType: KeyType.ECDSA_SECP256K1,
        readOnly: false,
        data: privateKey2.getPublicKey().bytes()
      }

      let identityCreateStateTransition

      // Set identity public key signature for public key 0
      identityCreateStateTransition = sdk.identities.createStateTransition('create', {
        publicKeys: [identityPublicKeyInCreation1, identityPublicKeyInCreation2],
        assetLockProof: {
          txid,
          outputIndex,
          coreChainLockedHeight,
          type: 'chainLock'
        }
      })
      identityCreateStateTransition.signByPrivateKey(privateKey1, KeyType.ECDSA_SECP256K1)
      identityPublicKeyInCreation1.signature = identityCreateStateTransition.signature

      // Set identity public key signature for public key 1
      identityCreateStateTransition = sdk.identities.createStateTransition('create', {
        publicKeys: [identityPublicKeyInCreation1, identityPublicKeyInCreation2],
        assetLockProof: {
          txid,
          outputIndex,
          coreChainLockedHeight,
          type: 'chainLock'
        }
      })
      identityCreateStateTransition.signByPrivateKey(privateKey2, KeyType.ECDSA_SECP256K1)
      identityPublicKeyInCreation2.signature = identityCreateStateTransition.signature

      // Finalize
      identityCreateStateTransition = sdk.identities.createStateTransition('create', {
        publicKeys: [identityPublicKeyInCreation1, identityPublicKeyInCreation2],
        assetLockProof: {
          txid,
          outputIndex,
          coreChainLockedHeight,
          type: 'chainLock'
        }
      })

      identityCreateStateTransition.signByPrivateKey(assetLockPrivateKey, KeyType.ECDSA_SECP256K1)
    })

    test('should be able to create IdentityCreateTransition via InstantSend', async () => {
      const assetLockPrivateKey = PrivateKeyWASM.fromHex('edd04a71bddb31e530f6c2314fd42ada333f6656bb853ece13f0577a8fd30612', 'testnet')
      const transaction = '03000800017dada5379e34ae1b59df35ba7acb879f3afaa12fa522f4b289a34d9fa2a68825010000006b48304502210093d609f65219e0d7ee694d271c4b7460ce89d298ef3e3670d5aef957e5551ead0220085d252e16cb3aae0d4e5d371e359e844fe82db93d8e4e26b5c61dc94676b7df0121037b86a1f7a11b4cc69fc7052e5cabdc625f3db47ee283ed4b87108f2cd879521effffffff0200e1f50500000000026a004054fa02000000001976a91416bbe230f46eea86fc4bf4dd550be45dc9adfcb488ac0000000024010100e1f505000000001976a914883bccdb8bfa44e55a19a1120ff2427537f7e92488ac'
      const instantLock = '01017dada5379e34ae1b59df35ba7acb879f3afaa12fa522f4b289a34d9fa2a688250100000060afc1323120f0a3b835dd113b3221e92dea56814369925f10dd3e8f6bcfaa6aa89ed4282521863d8eb72e7e0e7d80c86ca64cce9986ae8bb63657f43f0000009179b5d130fe69bd0f2ea7bc90e9ea904a7eeea515a2612045a70925a7c678b0b09499ea307575751e22f804c443d2e1105e1fd4e30aa894324a41cd983ffe58d5312ff8db11676bd530c6ab8af1f7d2980d356dd3c86d0386da7df70aa3a66b'
      const outputIndex = 0

      const privateKey1 = PrivateKeyWASM.fromHex('a1286dd195e2b8e1f6bdc946c56a53e0c544750d6452ddc0f4c593ef311f21af', 'testnet')
      const identityPublicKeyInCreation1: IdentityPublicKeyInCreation = {
        id: 0,
        purpose: Purpose.AUTHENTICATION,
        securityLevel: SecurityLevel.MASTER,
        keyType: KeyType.ECDSA_SECP256K1,
        readOnly: false,
        data: privateKey1.getPublicKey().bytes()
      }

      const privateKey2 = PrivateKeyWASM.fromHex('44a8195e242364b935e9d7ff2106ed109e9baf3800907f5e58a259fdfd1ca5e5', 'testnet')
      const identityPublicKeyInCreation2: IdentityPublicKeyInCreation = {
        id: 1,
        purpose: Purpose.AUTHENTICATION,
        securityLevel: SecurityLevel.HIGH,
        keyType: KeyType.ECDSA_SECP256K1,
        readOnly: false,
        data: privateKey2.getPublicKey().bytes()
      }
      let identityCreateStateTransition

      // Set identity public key signature for public key 0
      identityCreateStateTransition = sdk.identities.createStateTransition('create', {
        publicKeys: [identityPublicKeyInCreation1, identityPublicKeyInCreation2],
        assetLockProof: {
          transaction,
          instantLock,
          outputIndex,
          type: 'instantLock'
        }
      })
      identityCreateStateTransition.signByPrivateKey(privateKey1, KeyType.ECDSA_SECP256K1)
      identityPublicKeyInCreation1.signature = identityCreateStateTransition.signature

      // Set identity public key signature for public key 1
      identityCreateStateTransition = sdk.identities.createStateTransition('create', {
        publicKeys: [identityPublicKeyInCreation1, identityPublicKeyInCreation2],
        assetLockProof: {
          transaction,
          instantLock,
          outputIndex,
          type: 'instantLock'
        }
      })
      identityCreateStateTransition.signByPrivateKey(privateKey2, KeyType.ECDSA_SECP256K1)
      identityPublicKeyInCreation2.signature = identityCreateStateTransition.signature

      // Finalize
      identityCreateStateTransition = sdk.identities.createStateTransition('create', {
        publicKeys: [identityPublicKeyInCreation1, identityPublicKeyInCreation2],
        assetLockProof: {
          transaction,
          instantLock,
          outputIndex,
          type: 'instantLock'
        }
      })

      identityCreateStateTransition.signByPrivateKey(assetLockPrivateKey, KeyType.ECDSA_SECP256K1)
    })

    test('should be able to create IdentityTopUpTransition via InstantSend', async () => {
      const transaction = '03000800011a468e6a7cf1c5111b09b7bca6743f2571a9bf13d2ff6d21d3d230fd1dea1e97000000006b483045022100fceb25c45e77e1a273660e4f4c9a09042fb858a57704806e14bf80a734af232a02201929893dd720cf5855e31dda577cda16df29520a9774b4f3e813a4cc468fe086012103e16ede6dc5c99f28e3a5733f47a7494992bc6ce4f98551c092645910b9888b8fffffffff0200e1f50500000000026a004054fa02000000001976a91416bbe230f46eea86fc4bf4dd550be45dc9adfcb488ac0000000024010100e1f505000000001976a9147f78813975a3282e09e284d97d93c083b202e34188ac'
      const instantLock = '01011a468e6a7cf1c5111b09b7bca6743f2571a9bf13d2ff6d21d3d230fd1dea1e9700000000892304531821bcddfe960388f93e6e91bbae170987a5c6db33f0a4cf2d88ef148968a159512600791f94053e30f688aac43bf6e698fd78339a9ab5fd3b00000091ee77cadbf9683ca3d1fb1abcb2f561f0c745b26099fe5294885852a03a4f26770a3d437265f5f00ae21d0f681d0e1610a7ac47b6d463c3efdc5f7f922e310e6f3cd66c319e63e4f1c2cc70e97886e15485dba4f29b836bf55f0619837437e8'
      const outputIndex = 0

      const assetLockPrivateKey = PrivateKeyWASM.fromHex('3ca33236ab14f6df6cf87fcbb0551544fee7dcf4f251557af02c175725764a5a', 'testnet')
      const identityId = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'

      const identityTopUpTransaction = sdk.identities.createStateTransition('topUp', {
        identityId,
        assetLockProof: {
          transaction,
          instantLock,
          outputIndex,
          type: 'instantLock'
        }
      })

      identityTopUpTransaction.signByPrivateKey(assetLockPrivateKey, undefined, KeyType.ECDSA_SECP256K1)
    })

    test('should be able to create IdentityTopUpTransition via ChainLock', async () => {
      const txid = '61aede830477254876d435a317241ad46753c4b1350dc991a45ebcf19ab80a11'
      const outputIndex = 0
      const coreChainLockedHeight = 1337

      const assetLockPrivateKey = PrivateKeyWASM.fromHex('3ca33236ab14f6df6cf87fcbb0551544fee7dcf4f251557af02c175725764a5a', 'testnet')
      const identityId = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'

      const identityTopUpTransaction = sdk.identities.createStateTransition('topUp', {
        identityId,
        assetLockProof: {
          txid,
          outputIndex,
          coreChainLockedHeight,
          type: 'chainLock'
        }
      })

      identityTopUpTransaction.signByPrivateKey(assetLockPrivateKey, undefined, KeyType.ECDSA_SECP256K1)
    })

    test('should be able to create IdentityUpdateTransition', async () => {
      const identityId = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'
      const masterPrivateKey = PrivateKeyWASM.fromHex('16f614c6242580628d849e3616491dda1eccce99642a85667eb9a364dc85324a', 'testnet')
      const masterKeyId = 0

      const identity = await sdk.identities.getIdentityByIdentifier(identityId)

      const revision = identity.revision + BigInt(1)
      const identityNonce = await sdk.identities.getIdentityNonce(identityId) + BigInt(1)
      const keyId = identity.getPublicKeys()[identity.getPublicKeys().length - 1].keyId + 1
      const identityPrivateKey = PrivateKeyWASM.fromHex('16f614c6242580628d849e3616491dda1eccce99642a85667eb9a364dc85324a', 'testnet')

      const identityPublicKeyInCreation: IdentityPublicKeyInCreation = {
        id: keyId,
        purpose: Purpose.AUTHENTICATION,
        securityLevel: SecurityLevel.HIGH,
        keyType: KeyType.ECDSA_SECP256K1,
        readOnly: false,
        data: identityPrivateKey.getPublicKey().bytes()
      }

      let identityUpdateTransition = sdk.identities.createStateTransition('update', {
        identityId,
        revision,
        identityNonce,
        addPublicKeys: [identityPublicKeyInCreation]
      })
      identityUpdateTransition.signByPrivateKey(masterPrivateKey, masterKeyId, KeyType.ECDSA_SECP256K1)
      identityPublicKeyInCreation.signature = identityUpdateTransition.signature

      identityUpdateTransition = sdk.identities.createStateTransition('update', {
        identityId,
        revision,
        identityNonce,
        addPublicKeys: [identityPublicKeyInCreation]
      })

      identityUpdateTransition.signByPrivateKey(masterPrivateKey, masterKeyId, KeyType.ECDSA_SECP256K1)
    })
  })
})
