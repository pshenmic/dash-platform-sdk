import { readFileSync } from 'fs'
import { join } from 'path'
import { Proof, ResponseMetadata } from '../../proto/generated/platform.js'
import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'
import { GRPCPool } from '../../src/grpcConnectionPool.js'
import verifyProofSignature, {
  ProofVerificationContext,
  QuorumKeyProvider,
  QuorumKeyRequest
} from '../../src/utils/verifyProofSignature.js'
import {
  ProofSignatureError,
  QuorumKeyUnavailableError,
  StaleResponseError,
  UnexpectedQuorumTypeError
} from '../../src/utils/proofVerificationErrors.js'
import hexToBytes from '../../src/utils/hexToBytes.js'
import bytesToHex from '../../src/utils/bytesToHex.js'

// Real testnet getIdentityBalance proof, rootHash is the result of its GroveDB verification
const fixture = JSON.parse(readFileSync(join(__dirname, 'fixtures', 'identityBalanceProof.testnet.json'), 'utf8'))

const proof = Proof.create({
  grovedbProof: hexToBytes(fixture.proof.grovedbProof),
  quorumHash: hexToBytes(fixture.proof.quorumHash),
  signature: hexToBytes(fixture.proof.signature),
  round: fixture.proof.round,
  blockIdHash: hexToBytes(fixture.proof.blockIdHash),
  quorumType: fixture.proof.quorumType
})
const metadata = ResponseMetadata.create(fixture.metadata)
const rootHash = hexToBytes(fixture.rootHash)
const quorumPublicKeyHex: string = fixture.quorumPublicKey
const quorumHashHex: string = fixture.proof.quorumHash
const quorumPublicKey = hexToBytes(quorumPublicKeyHex)
const wrongKey = hexToBytes(quorumPublicKeyHex.replace(/^../, quorumPublicKeyHex.startsWith('aa') ? 'bb' : 'aa'))

const responseTime = Number(fixture.metadata.timeMs)

const tamperedProof = (): Proof => {
  const signature = proof.signature.slice()
  signature[signature.length - 1] ^= 1

  return { ...proof, signature }
}

const recordingProvider = (...keys: Array<Uint8Array | null | Error>): QuorumKeyProvider & { requests: QuorumKeyRequest[] } => {
  const requests: QuorumKeyRequest[] = []

  const provider = async (request: QuorumKeyRequest): Promise<Uint8Array | null> => {
    requests.push(request)

    const key = keys[Math.min(requests.length, keys.length) - 1]

    if (key instanceof Error) {
      throw key
    }

    return key
  }

  return Object.assign(provider, { requests })
}

describe('Proof verification', () => {
  let fetchSpy: jest.SpyInstance

  const pool = (network: 'testnet' | 'mainnet' = 'testnet'): GRPCPool => ({ network, getClient: () => { throw new Error('not used') } })

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(responseTime + 60 * 1000)
    fetchSpy = jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network is not allowed in this test'))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should verify real testnet proof with a static provider, quorumHash is in Core RPC byte order', async () => {
    const provider = recordingProvider(quorumPublicKey)

    await new ProofVerificationContext('testnet', { quorumKeyProvider: provider }).verify(proof, metadata, rootHash)

    expect(provider.requests).toHaveLength(1)

    const [request] = provider.requests

    // hex of the raw proof bytes is the hash as shown by Dash Core RPC and DAPI getCurrentQuorumsInfo
    expect(bytesToHex(request.quorumHash)).toEqual('00000020d10c69ac9aa6b78072691d62bb215028a6847c662dd78fddb1bba8cd')
    expect(request).toEqual({
      network: 'testnet',
      quorumType: 6,
      quorumHash: expect.any(Uint8Array),
      coreChainLockedHeight: fixture.metadata.coreChainLockedHeight,
      platformHeight: BigInt(fixture.metadata.height),
      reason: 'lookup'
    })
  })

  test('should use Platform Explorer provider when no proofs option is passed', async () => {
    fetchSpy.mockResolvedValue(new Response(JSON.stringify({ quorumPublicKey: quorumPublicKeyHex }), { status: 200 }))

    await new ProofVerificationContext('testnet').verify(proof, metadata, rootHash)

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(String(fetchSpy.mock.calls[0][0])).toEqual(`https://testnet.platform-explorer.pshenmic.dev/quorum/info?quorumType=6&quorumHash=${quorumHashHex}`)
  })

  test('should throw QuorumKeyUnavailableError when provider returns null, without asking any other source', async () => {
    const provider = recordingProvider(null)

    await expect(new ProofVerificationContext('testnet', { quorumKeyProvider: provider }).verify(proof, metadata, rootHash))
      .rejects.toThrow(QuorumKeyUnavailableError)

    expect(provider.requests).toHaveLength(1)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('should throw QuorumKeyUnavailableError carrying provider error when provider throws', async () => {
    const providerError = new Error('spv is not synced')
    const provider = recordingProvider(providerError)

    const error = await new ProofVerificationContext('testnet', { quorumKeyProvider: provider })
      .verify(proof, metadata, rootHash)
      .catch(e => e)

    expect(error).toBeInstanceOf(QuorumKeyUnavailableError)
    expect(error.cause).toBe(providerError)
    expect(error.quorumType).toEqual(6)
    expect(provider.requests).toHaveLength(1)
  })

  test('should treat a key of wrong length as unavailable', async () => {
    const provider = recordingProvider(new Uint8Array(32))

    await expect(new ProofVerificationContext('testnet', { quorumKeyProvider: provider }).verify(proof, metadata, rootHash))
      .rejects.toThrow(QuorumKeyUnavailableError)
  })

  test('should ask the provider again with rejectedKey after a signature mismatch', async () => {
    const provider = recordingProvider(wrongKey, quorumPublicKey)

    await new ProofVerificationContext('testnet', { quorumKeyProvider: provider }).verify(proof, metadata, rootHash)

    expect(provider.requests).toHaveLength(2)
    expect(provider.requests[1]).toEqual(expect.objectContaining({
      reason: 'signature-mismatch',
      rejectedKey: wrongKey
    }))
  })

  test('should throw ProofSignatureError when the retry returns the same key, null or another wrong key', async () => {
    for (const retryKey of [wrongKey, null, hexToBytes('cc'.repeat(48))]) {
      const provider = recordingProvider(wrongKey, retryKey)

      await expect(new ProofVerificationContext('testnet', { quorumKeyProvider: provider }).verify(proof, metadata, rootHash))
        .rejects.toThrow(ProofSignatureError)

      expect(provider.requests).toHaveLength(2)
    }

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('should not retry when keyRetry is false', async () => {
    const provider = recordingProvider(wrongKey, quorumPublicKey)

    await expect(new ProofVerificationContext('testnet', { quorumKeyProvider: provider, keyRetry: false }).verify(proof, metadata, rootHash))
      .rejects.toThrow(ProofSignatureError)

    expect(provider.requests).toHaveLength(1)
  })

  test('should use cached key without calling the provider', async () => {
    const provider = recordingProvider(quorumPublicKey)
    const context = new ProofVerificationContext('testnet', { quorumKeyProvider: provider })

    await context.verify(proof, metadata, rootHash)
    await context.verify(proof, metadata, rootHash)

    expect(provider.requests).toHaveLength(1)
  })

  test('should reject a bad signature with the cached key, without calling the provider or evicting the key', async () => {
    const provider = recordingProvider(quorumPublicKey)
    const context = new ProofVerificationContext('testnet', { quorumKeyProvider: provider })

    await context.verify(proof, metadata, rootHash)

    await expect(context.verify(tamperedProof(), metadata, rootHash)).rejects.toThrow(ProofSignatureError)
    await context.verify(proof, metadata, rootHash)

    expect(provider.requests).toHaveLength(1)
  })

  test('should not share cache between SDK instances', async () => {
    const providerA = recordingProvider(quorumPublicKey)
    const providerB = recordingProvider(quorumPublicKey)

    const sdkA = new DashPlatformSDK({ network: 'testnet', grpc: { pool: pool() }, proofs: { quorumKeyProvider: providerA } })
    const sdkB = new DashPlatformSDK({ network: 'testnet', grpc: { pool: pool() }, proofs: { quorumKeyProvider: providerB } })

    await verifyProofSignature(sdkA.grpcPool, proof, metadata, rootHash)
    await verifyProofSignature(sdkA.grpcPool, proof, metadata, rootHash)
    await verifyProofSignature(sdkB.grpcPool, proof, metadata, rootHash)

    expect(providerA.requests).toHaveLength(1)
    expect(providerB.requests).toHaveLength(1)
  })

  test('should reject a proof of the wrong quorum type for the network', async () => {
    const provider = recordingProvider(quorumPublicKey)
    const sdk = new DashPlatformSDK({ network: 'mainnet', grpc: { pool: pool('mainnet') }, proofs: { quorumKeyProvider: provider } })

    const error = await verifyProofSignature(sdk.grpcPool, proof, metadata, rootHash).catch(e => e)

    expect(error).toBeInstanceOf(UnexpectedQuorumTypeError)
    expect(error.expected).toEqual(4)
    expect(error.actual).toEqual(6)
    expect(provider.requests).toHaveLength(0)
  })

  test('should reject old and future-dated responses', async () => {
    const provider = recordingProvider(quorumPublicKey)
    const context = new ProofVerificationContext('testnet', { quorumKeyProvider: provider })

    jest.spyOn(Date, 'now').mockReturnValue(responseTime + 16 * 60 * 1000)
    await expect(context.verify(proof, metadata, rootHash)).rejects.toThrow(StaleResponseError)

    jest.spyOn(Date, 'now').mockReturnValue(responseTime - 3 * 60 * 1000)
    await expect(context.verify(proof, metadata, rootHash)).rejects.toThrow(StaleResponseError)

    jest.spyOn(Date, 'now').mockReturnValue(responseTime - 60 * 1000)
    await expect(context.verify(proof, metadata, rootHash)).resolves.toBeUndefined()

    expect(provider.requests).toHaveLength(1)
  })

  describe('switching options on the fly', () => {
    test('should use the new provider and drop keys cached from the previous one', async () => {
      const providerA = recordingProvider(quorumPublicKey)
      const providerB = recordingProvider(quorumPublicKey)

      const sdk = new DashPlatformSDK({ network: 'testnet', grpc: { pool: pool() }, proofs: { quorumKeyProvider: providerA } })

      await verifyProofSignature(sdk.grpcPool, proof, metadata, rootHash)

      sdk.setProofOptions({ quorumKeyProvider: providerB })

      await verifyProofSignature(sdk.grpcPool, proof, metadata, rootHash)

      expect(providerA.requests).toHaveLength(1)
      expect(providerB.requests).toHaveLength(1)
      expect(sdk.getProofOptions()?.quorumKeyProvider).toBe(providerB)
    })

    test('should allow changing only some options', async () => {
      const provider = recordingProvider(wrongKey, quorumPublicKey)

      const sdk = new DashPlatformSDK({ network: 'testnet', grpc: { pool: pool() }, proofs: { quorumKeyProvider: provider } })

      sdk.setProofOptions({ ...sdk.getProofOptions(), keyRetry: false })

      await expect(verifyProofSignature(sdk.grpcPool, proof, metadata, rootHash)).rejects.toThrow(ProofSignatureError)

      expect(provider.requests).toHaveLength(1)
    })

    test('should restore defaults when called without options', async () => {
      fetchSpy.mockResolvedValue(new Response(JSON.stringify({ quorumPublicKey: quorumPublicKeyHex }), { status: 200 }))
      const provider = recordingProvider(quorumPublicKey)

      const sdk = new DashPlatformSDK({ network: 'testnet', grpc: { pool: pool() }, proofs: { quorumKeyProvider: provider } })

      sdk.setProofOptions()

      await verifyProofSignature(sdk.grpcPool, proof, metadata, rootHash)

      expect(sdk.getProofOptions()).toBeUndefined()
      expect(provider.requests).toHaveLength(0)
      expect(fetchSpy).toHaveBeenCalledTimes(1)
    })

    test('should keep options after the GRPC pool is replaced', async () => {
      const provider = recordingProvider(quorumPublicKey)

      const sdk = new DashPlatformSDK({ network: 'testnet', grpc: { pool: pool() } })

      sdk.setProofOptions({ quorumKeyProvider: provider })
      sdk.setGRPCPool(pool())

      await verifyProofSignature(sdk.grpcPool, proof, metadata, rootHash)

      expect(provider.requests).toHaveLength(1)
      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })
})
