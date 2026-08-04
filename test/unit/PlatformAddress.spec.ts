import {
  AddressFundsFeeStrategyStepWASM,
  AddressWitnessWASM,
  AssetLockProofWASM,
  CoreScriptWASM,
  IdentityPublicKeyInCreationWASM,
  InputAddressWASM,
  OutputAddressWASM,
  OutputAddressNullableCreditsWASM,
  KeyType,
  OutPointWASM,
  PlatformAddressWASM,
  PrivateKeyWASM,
  Purpose,
  SecurityLevel,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { base58 } from '@scure/base'
import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'

let sdk: DashPlatformSDK

describe('PlatformAddress', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet' })
  })

  test('getAddressInfo', async () => {
    const info = await sdk.platformAddresses.getAddressInfo('tdash1kzg5azscav69z7m6dfzr9ner0a5vt7pn9ca4sz8d')

    expect(info.balance).toBeDefined()
    expect(info.nonce).toBeDefined()
    expect(info.address).toBeDefined()
  })

  test('getAddressesInfos', async () => {
    const addresses = [
      'tdash1kzg5azscav69z7m6dfzr9ner0a5vt7pn9ca4sz8d',
      'tdash1kqr3cxhgel75ru0yrhj5eq8j8jt92m5enqrfajxw',
      'tdash1kzpjkv364ez6yyaqyvxfdgzcdet2h4mumqcjd2yx'
    ]
    const info = await sdk.platformAddresses.getAddressesInfos(addresses)

    expect(info).toHaveLength(addresses.length)
  })

  test('getAddressesTrunkState', async () => {
    const { trunk, metadata } = await sdk.platformAddresses.getAddressesTrunkState()

    expect(trunk.rootHash).toEqual(expect.any(Uint8Array))
    expect(trunk.elements.length).toBeGreaterThan(0)
    expect(trunk.chunkDepths.length).toBeGreaterThan(0)
    expect(metadata.height).toBeDefined()
  })

  test('getAddressesBranchState', async () => {
    const { trunk, metadata } = await sdk.platformAddresses.getAddressesTrunkState()

    // The whole tree fits in the trunk when it is small enough - nothing to descend into
    if (trunk.leafKeys.length === 0) {
      return
    }

    const [leaf] = trunk.leafKeys
    const depth = trunk.chunkDepths[1] ?? trunk.chunkDepths[0]

    const branch = await sdk.platformAddresses.getAddressesBranchState(leaf.key, depth, BigInt(metadata.height), leaf.hash)

    expect(branch.branchRootHash).toEqual(leaf.hash)
    expect(branch.elements.length).toBeGreaterThan(0)
  })

  test('getRecentAddressBalanceChanges', async () => {
    const blocks = await sdk.platformAddresses.getRecentAddressBalanceChanges(1n)

    expect(Array.isArray(blocks)).toBe(true)

    for (const block of blocks) {
      expect(block.blockHeight).toEqual(expect.any(BigInt))

      for (const change of block.changes) {
        expect(change.address).toEqual(expect.any(PlatformAddressWASM))
        expect(['setCredits', 'addToCredits']).toContain(change.operation)
        expect(change.credits).toEqual(expect.any(BigInt))
      }
    }
  })

  test('getRecentCompactedAddressBalanceChanges', async () => {
    const ranges = await sdk.platformAddresses.getRecentCompactedAddressBalanceChanges(1n)

    expect(Array.isArray(ranges)).toBe(true)

    for (const range of ranges) {
      expect(range.startBlockHeight).toEqual(expect.any(BigInt))
      expect(range.endBlockHeight).toBeGreaterThanOrEqual(range.startBlockHeight)

      for (const change of range.changes) {
        expect(change.address).toEqual(expect.any(PlatformAddressWASM))
        expect(['setCredits', 'addToCreditsOperations']).toContain(change.operation)
      }
    }
  })

  describe('createStateTransition', () => {
    const identityId = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

    const addressA = PlatformAddressWASM.fromBech32m('tdash1kzg5azscav69z7m6dfzr9ner0a5vt7pn9ca4sz8d')
    const addressB = PlatformAddressWASM.fromBech32m('tdash1kqr3cxhgel75ru0yrhj5eq8j8jt92m5enqrfajxw')

    const inputs = [new InputAddressWASM(addressA, 0, 100000n)]
    const outputs = [new OutputAddressWASM(addressB, 50000n)]
    const recipients = [new OutputAddressWASM(addressB, 50000n)]
    const nullableOutputs = [new OutputAddressNullableCreditsWASM(addressB)]
    const feeStrategy = [AddressFundsFeeStrategyStepWASM.DeductFromInput(1)]
    const inputWitness = [AddressWitnessWASM.P2PKH(new Uint8Array(65))]
    const output = new OutputAddressWASM(addressA, 10000n)
    const nonce = 1n

    const privateKey = PrivateKeyWASM.fromHex('a1286dd195e2b8e1f6bdc946c56a53e0c544750d6452ddc0f4c593ef311f21af', 'testnet')
    const publicKeys = [
      new IdentityPublicKeyInCreationWASM(0, Purpose.AUTHENTICATION, SecurityLevel.MASTER, KeyType.ECDSA_SECP256K1, false, privateKey.getPublicKey().bytes())
    ]

    const assetLockProof = AssetLockProofWASM.createChainAssetLockProof(1337, new OutPointWASM('61aede830477254876d435a317241ad46753c4b1350dc991a45ebcf19ab80a11', 0))

    const withdrawalAddress = 'yjHVQ3dj37UJwXFmvMTKR9ZVfoJSc3opTD'
    const outputScript = CoreScriptWASM.newP2PKH(base58.decode(withdrawalAddress).slice(1, 21))

    test('should be able to create identityCreditTransferToAddresses', () => {
      const stateTransition = sdk.platformAddresses.createStateTransition('identityCreditTransferToAddresses', {
        identityId, recipients, nonce
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should throw when identityCreditTransferToAddresses is missing recipients', () => {
      // @ts-expect-error testing the runtime missing-param check
      expect(() => sdk.platformAddresses.createStateTransition('identityCreditTransferToAddresses', {
        identityId, nonce
      })).toThrow('Platform address transition param "recipients" is missing')
    })

    test('should be able to create identityCreateFromAddresses', () => {
      const stateTransition = sdk.platformAddresses.createStateTransition('identityCreateFromAddresses', {
        publicKeys, inputs, feeStrategy, inputWitness
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should throw when identityCreateFromAddresses is missing publicKeys', () => {
      // @ts-expect-error testing the runtime missing-param check
      expect(() => sdk.platformAddresses.createStateTransition('identityCreateFromAddresses', {
        inputs, feeStrategy, inputWitness
      })).toThrow('Platform address transition param "publicKeys" is missing')
    })

    test('should be able to create identityTopUpFromAddresses', () => {
      const stateTransition = sdk.platformAddresses.createStateTransition('identityTopUpFromAddresses', {
        identityId, inputs, feeStrategy, inputWitness
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should throw when identityTopUpFromAddresses is missing identityId', () => {
      // @ts-expect-error testing the runtime missing-param check
      expect(() => sdk.platformAddresses.createStateTransition('identityTopUpFromAddresses', {
        inputs, feeStrategy, inputWitness
      })).toThrow('Platform address transition param "identityId" is missing')
    })

    test('should be able to create addressFundsTransfer', () => {
      const stateTransition = sdk.platformAddresses.createStateTransition('addressFundsTransfer', {
        inputs, feeStrategy, inputWitness, outputs
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should throw when addressFundsTransfer is missing outputs', () => {
      // @ts-expect-error testing the runtime missing-param check
      expect(() => sdk.platformAddresses.createStateTransition('addressFundsTransfer', {
        inputs, feeStrategy, inputWitness
      })).toThrow('Platform address transition param "outputs" is missing')
    })

    test('should be able to create addressFundingFromAssetLock', () => {
      const stateTransition = sdk.platformAddresses.createStateTransition('addressFundingFromAssetLock', {
        assetLockProof, inputs, feeStrategy, inputWitness, outputs: nullableOutputs
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should throw when addressFundingFromAssetLock is missing assetLockProof', () => {
      // @ts-expect-error testing the runtime missing-param check
      expect(() => sdk.platformAddresses.createStateTransition('addressFundingFromAssetLock', {
        inputs, feeStrategy, inputWitness, outputs: nullableOutputs
      })).toThrow('Platform address transition param "assetLockProof" is missing')
    })

    test('should be able to create addressCreditWithdrawal', () => {
      const stateTransition = sdk.platformAddresses.createStateTransition('addressCreditWithdrawal', {
        inputs, feeStrategy, coreFeePerByte: 1, pooling: 'Standard', outputScript, inputWitness
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should be able to create addressCreditWithdrawal with optional output', () => {
      const stateTransition = sdk.platformAddresses.createStateTransition('addressCreditWithdrawal', {
        inputs, feeStrategy, coreFeePerByte: 1, pooling: 'Standard', outputScript, inputWitness, output
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should throw when addressCreditWithdrawal is missing outputScript', () => {
      // @ts-expect-error testing the runtime missing-param check
      expect(() => sdk.platformAddresses.createStateTransition('addressCreditWithdrawal', {
        inputs, feeStrategy, coreFeePerByte: 1, pooling: 'Standard', inputWitness
      })).toThrow('Platform address transition param "outputScript" is missing')
    })

    test('should default userFeeIncrease to 0 when omitted', () => {
      const stateTransition = sdk.platformAddresses.createStateTransition('addressFundsTransfer', {
        inputs, feeStrategy, inputWitness, outputs
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    })

    test('should throw on unimplemented transition type', () => {
      expect(() => sdk.platformAddresses.createStateTransition(
        // @ts-expect-error testing an unknown transition type
        'unknownTransition', {})).toThrow('Unimplemented transition type: unknownTransition')
    })
  })
})
