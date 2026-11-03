import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'
import { PlatformExplorerQuorumKeyProvider, QuorumKeyProvider } from '../../src/quorumKeyProvider.js'
import { getVerifierVersion } from '../../src/QueryExecutor.js'
import { LATEST_PLATFORM_VERSION, MIN_PROTOCOL_VERSION } from '../../src/constants.js'

let sdk: DashPlatformSDK

const identifier = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

// takes quorum public keys from DAPI validator sets, so proofs can be verified without Platform Explorer
const createQuorumKeyProvider = (sdk: DashPlatformSDK): QuorumKeyProvider & { requests: string[] } => {
  const requests: string[] = []

  return {
    requests,
    getQuorumPublicKey: async (quorumType: number, quorumHash: string): Promise<string> => {
      requests.push(quorumHash)

      const { validatorSets } = await sdk.node.getCurrentQuorumsInfo()
      const validatorSet = validatorSets.find(validatorSet => validatorSet.quorumHash === quorumHash)

      if (validatorSet == null) {
        throw new Error(`Unknown quorum ${quorumHash}`)
      }

      return validatorSet.thresholdPublicKey
    }
  }
}

describe('DashPlatformSDK', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet' })
  })

  test('should be constructable throw `new`', () => {
    expect(sdk).toEqual(expect.any(DashPlatformSDK))
  })

  test('should use Platform Explorer quorum key provider by default', () => {
    expect(sdk.quorumKeyProvider).toEqual(expect.any(PlatformExplorerQuorumKeyProvider))
  })

  test('should verify proofs with custom quorum key provider', async () => {
    const customSdk = new DashPlatformSDK({ network: 'testnet' })
    const quorumKeyProvider = createQuorumKeyProvider(customSdk)

    customSdk.setQuorumKeyProvider(quorumKeyProvider)

    const balance = await customSdk.identities.getIdentityBalance(identifier)

    expect(balance).toEqual(expect.any(BigInt))
    expect(quorumKeyProvider.requests).toHaveLength(1)
  })

  test('should not share quorum key provider between instances', () => {
    const quorumKeyProvider = createQuorumKeyProvider(sdk)

    const customSdk = new DashPlatformSDK({ network: 'testnet', quorumKeyProvider })
    const defaultSdk = new DashPlatformSDK({ network: 'testnet' })

    expect(customSdk.quorumKeyProvider).toBe(quorumKeyProvider)
    expect(defaultSdk.quorumKeyProvider).toEqual(expect.any(PlatformExplorerQuorumKeyProvider))
    expect(defaultSdk.quorumKeyProvider).not.toBe(sdk.quorumKeyProvider)
  })

  test('should switch back to Platform Explorer quorum key provider', () => {
    const customSdk = new DashPlatformSDK({ network: 'testnet', quorumKeyProvider: createQuorumKeyProvider(sdk) })

    customSdk.setQuorumKeyProvider()

    expect(customSdk.quorumKeyProvider).toEqual(expect.any(PlatformExplorerQuorumKeyProvider))
  })

  test('should learn protocol version of the network from verified responses', async () => {
    const customSdk = new DashPlatformSDK({ network: 'testnet' })

    expect(customSdk.grpcPool.protocolVersion).toEqual(MIN_PROTOCOL_VERSION.testnet)

    await customSdk.identities.getIdentityBalance(identifier)

    expect(customSdk.grpcPool.protocolVersion).toEqual(LATEST_PLATFORM_VERSION)
  })

  test('should not learn protocol version from unverified responses', async () => {
    const customSdk = new DashPlatformSDK({ network: 'testnet', proofs: false })

    await customSdk.identities.getIdentityBalance(identifier)

    expect(customSdk.grpcPool.protocolVersion).toEqual(MIN_PROTOCOL_VERSION.testnet)
  })

  test('should select platform version to verify proofs with', () => {
    // newer signed version is used
    expect(getVerifierVersion(13, 14)).toEqual(14)
    // older signed version is not
    expect(getVerifierVersion(14, 13)).toEqual(14)
    expect(getVerifierVersion(13, 0)).toEqual(13)
    // unknown version falls back to the latest known one
    expect(getVerifierVersion(13, LATEST_PLATFORM_VERSION + 1)).toEqual(LATEST_PLATFORM_VERSION)
  })

  test('should be able to deserialize consensus error', () => {
    const err = sdk.utils.deserializeConsensusError('AwIiSW52YWxpZCBTdGF0ZSBUcmFuc2l0aW9uIHNpZ25hdHVyZQ')

    expect(err).toEqual('Invalid State Transition signature')
  })
})
