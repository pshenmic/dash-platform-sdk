import {
  AddressFundsFeeStrategyStepWASM,
  AssetLockProofWASM,
  CommitmentTreeWASM,
  CoreScriptWASM,
  InputAddressWASM,
  KeyType,
  NoteWASM,
  OrchardAddressWASM,
  OutPointWASM,
  PlatformAddressWASM,
  PrivateKeyWASM,
  Purpose,
  RecoveredNoteWASM,
  SecurityLevel,
  SpendableNoteWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import {DashPlatformSDK} from '../../src/DashPlatformSDK.js'
import {IdentityPublicKeyInCreation} from "../../types.js";

let sdk: DashPlatformSDK

const COIN_TYPE = 1
const ACCOUNT = 0

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256)
  }
  return bytes
}

// Builds a 21-byte (version + pubkey hash) platform address.
function platformAddress(keyHash: Uint8Array = randomBytes(20)): PlatformAddressWASM {
  const bytes = new Uint8Array(21)
  bytes[0] = 0x00
  bytes.set(keyHash, 1)
  return PlatformAddressWASM.fromBytes(bytes)
}

// Builds a spendable note owned by `seed` and a matching anchor by inserting its
// commitment into a fresh commitment tree and witnessing it.
function makeSpendableNote(seed: Uint8Array, value: bigint): {
  spend: SpendableNoteWASM,
  anchor: Uint8Array,
  owner: OrchardAddressWASM
} {
  const owner = OrchardAddressWASM.fromSeed(seed, COIN_TYPE, ACCOUNT)

  const rho = randomBytes(32)
  rho[31] &= 0x1f // keep rho a valid Pallas base field element
  const note = new NoteWASM(owner, value, rho, randomBytes(32))

  const tree = new CommitmentTreeWASM()
  tree.append(note.cmx, true)
  tree.checkpoint(0)

  const anchor = tree.anchor()
  const merklePath = tree.witness(0, 0) ?? tree.witness(0, 1)

  if (merklePath == null) {
    throw new Error('failed to witness note')
  }

  return {spend: new SpendableNoteWASM(note, merklePath), anchor, owner}
}

describe('Shielded', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({network: 'testnet'})
  })

  test('getShieldedNotesCount', async () => {
    const count = await sdk.shielded.getShieldedNotesCount()

    expect(typeof count).toBe('bigint')
  })

  test('getShieldedPoolState', async () => {
    const totalBalance = await sdk.shielded.getShieldedPoolState()

    expect(typeof totalBalance).toBe('bigint')
  })

  test('getShieldedAnchors', async () => {
    const anchors = await sdk.shielded.getShieldedAnchors()

    expect(Array.isArray(anchors)).toBe(true)

    for (const anchor of anchors) {
      expect(anchor).toBeInstanceOf(Uint8Array)
    }
  })

  test('getMostRecentShieldedAnchor', async () => {
    const anchor = await sdk.shielded.getMostRecentShieldedAnchor()

    expect(anchor).toBeInstanceOf(Uint8Array)
  })

  test('getShieldedEncryptedNotes', async () => {
    const count = await sdk.shielded.getShieldedNotesCount() ?? 0n

    const requested = Number(count > 10n ? 10n : count)

    const notes = await sdk.shielded.getShieldedEncryptedNotes(0n, requested)

    expect(notes).toHaveLength(requested)

    for (const note of notes) {
      expect(note.nullifier).toBeInstanceOf(Uint8Array)
      expect(note.cmx).toBeInstanceOf(Uint8Array)
      expect(note.encryptedNote).toBeInstanceOf(Uint8Array)
      expect(note.cvNet).toBeInstanceOf(Uint8Array)
    }
  })

  test('getShieldedNullifiers', async () => {
    const notes = await sdk.shielded.getShieldedEncryptedNotes(0n, 1)

    const nullifiers = notes.map(note => note.nullifier)

    const statuses = await sdk.shielded.getShieldedNullifiers(nullifiers)

    expect(statuses).toHaveLength(nullifiers.length)

    for (const status of statuses) {
      expect(status.nullifier).toBeInstanceOf(Uint8Array)
      expect(typeof status.isSpent).toBe('boolean')
    }
  })

  test('recoverNotes', () => {
    const seed = randomBytes(32)
    const notes = [
      { nullifier: randomBytes(32), cmx: randomBytes(32), encryptedNote: randomBytes(580), cvNet: randomBytes(32) }
    ]

    const recovered = sdk.shielded.recoverNotes(notes, seed, ACCOUNT)

    // random notes are not addressed to this seed, so none are recovered
    expect(Array.isArray(recovered)).toBe(true)
    expect(recovered).toHaveLength(0)
  })

  test('buildSpendableNotes produces a spend usable by a transition', () => {
    const seed = randomBytes(32)
    const owner = OrchardAddressWASM.fromSeed(seed, COIN_TYPE, ACCOUNT)

    const rho = randomBytes(32)
    rho[31] &= 0x1f
    const note = new NoteWASM(owner, BigInt(10000000000), rho, randomBytes(32))

    // the on-chain note set: only `cmx` matters for rebuilding the tree
    const notes = [
      { nullifier: randomBytes(32), cmx: note.cmx, encryptedNote: randomBytes(580), cvNet: randomBytes(32) }
    ]
    // buildSpendableNotes only reads `.note` and `.index` off a recovered note
    const recovered = [{ note, index: 0 } as unknown as RecoveredNoteWASM]

    const { spends, anchor } = sdk.shielded.buildSpendableNotes(notes, recovered)

    expect(spends).toHaveLength(1)
    expect(spends[0]).toEqual(expect.any(SpendableNoteWASM))
    expect(anchor).toBeInstanceOf(Uint8Array)

    // the produced spend + anchor must actually prove a spend transition
    const stateTransition = sdk.shielded.createStateTransition('shieldedTransfer', {
      spends,
      recipient: OrchardAddressWASM.fromSeed(randomBytes(32), COIN_TYPE, ACCOUNT),
      transferAmount: BigInt(1000000),
      changeAddress: owner,
      seed,
      coinType: COIN_TYPE,
      account: ACCOUNT,
      anchor
    })

    expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
  }, 60000)

  describe('should be able to create state transition', () => {
    test('should be able to create a shield transition', () => {
      const seed = randomBytes(32)
      const recipient = OrchardAddressWASM.fromSeed(seed, COIN_TYPE, ACCOUNT)
      const privateKey = new PrivateKeyWASM(randomBytes(32), 'testnet')
      const address = platformAddress(privateKey.getPublicKey().hash160())

      const stateTransition = sdk.shielded.createStateTransition('shield', {
        recipient,
        shieldAmount: BigInt(50000000),
        inputs: [new InputAddressWASM(address, 0, BigInt(100000000))],
        privateKeys: [privateKey],
        feeStrategy: [AddressFundsFeeStrategyStepWASM.DeductFromInput(0)],
        userFeeIncrease: 0
        // memo omitted -> defaults to an empty memo
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    }, 60000)

    test('should be able to create a shieldFromAssetLock transition', () => {
      const seed = randomBytes(32)
      const recipient = OrchardAddressWASM.fromSeed(seed, COIN_TYPE, ACCOUNT)
      const privateKey = PrivateKeyWASM.fromHex('edd04a71bddb31e530f6c2314fd42ada333f6656bb853ece13f0577a8fd30612', 'testnet')
      const txid = '61aede830477254876d435a317241ad46753c4b1350dc991a45ebcf19ab80a11'
      const assetLockProof = AssetLockProofWASM.createChainAssetLockProof(1337, new OutPointWASM(txid, 0))

      const stateTransition = sdk.shielded.createStateTransition('shieldFromAssetLock', {
        recipient,
        shieldAmount: BigInt(50000000),
        assetLockProof,
        privateKey,
        memo: 'shielded-memo-padded-to-32-bytes',
        dummyOutputs: 0
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    }, 60000)

    test('should be able to create a shieldedTransfer transition', () => {
      const seed = randomBytes(32)
      const {spend, anchor, owner} = makeSpendableNote(seed, BigInt(10000000000))
      const recipient = OrchardAddressWASM.fromSeed(randomBytes(32), COIN_TYPE, ACCOUNT)

      const stateTransition = sdk.shielded.createStateTransition('shieldedTransfer', {
        spends: [spend],
        recipient,
        transferAmount: BigInt(1000000),
        changeAddress: owner,
        seed,
        coinType: COIN_TYPE,
        account: ACCOUNT,
        anchor,
        memo: 'shielded-memo-padded-to-32-bytes'
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    }, 60000)

    test('should be able to create an unshield transition', () => {
      const seed = randomBytes(32)
      const {spend, anchor, owner} = makeSpendableNote(seed, BigInt(10000000000))

      const stateTransition = sdk.shielded.createStateTransition('unshield', {
        spends: [spend],
        outputAddress: platformAddress(),
        unshieldAmount: BigInt(1000000),
        changeAddress: owner,
        seed,
        coinType: COIN_TYPE,
        account: ACCOUNT,
        anchor,
        memo: 'shielded-memo-padded-to-32-bytes'
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    }, 60000)

    test('should be able to create a shieldedWithdrawal transition', () => {
      const seed = randomBytes(32)
      const {spend, anchor, owner} = makeSpendableNote(seed, BigInt(10000000000))

      const stateTransition = sdk.shielded.createStateTransition('shieldedWithdrawal', {
        spends: [spend],
        withdrawalAmount: BigInt(1000000),
        outputScript: CoreScriptWASM.newP2PKH(randomBytes(20)),
        coreFeePerByte: 1,
        pooling: 'Standard',
        changeAddress: owner,
        seed,
        coinType: COIN_TYPE,
        account: ACCOUNT,
        anchor,
        memo: 'shielded-memo-padded-to-32-bytes'
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    }, 60000)

    // The proving step succeeds, but `IdentityCreateFromShieldedPoolResultWASM.identityId`
    // (read while assembling the transition) rejects the derived id for synthetic notes.
    // A real run needs a funded note and signed keys, so this is covered against a live pool.
    test('should be able to create an identityCreateFromShieldedPool transition', () => {
      const seed = randomBytes(32)
      const {spend, anchor, owner} = makeSpendableNote(seed, BigInt(20000000000))

      const privateKey = PrivateKeyWASM.fromHex('a1286dd195e2b8e1f6bdc946c56a53e0c544750d6452ddc0f4c593ef311f21af', 'testnet')
      const identityPublicKeyInCreation: IdentityPublicKeyInCreation = {
        id: 0,
        purpose: Purpose.AUTHENTICATION,
        securityLevel: SecurityLevel.MASTER,
        keyType: KeyType.ECDSA_SECP256K1,
        readOnly: false,
        data: privateKey.getPublicKey().bytes()
      }

      const stateTransition = sdk.shielded.createStateTransition('identityCreateFromShieldedPool', {
        publicKeys: [identityPublicKeyInCreation],
        privateKeys: [privateKey],
        denomination: BigInt(10000000000),
        sendToAddressOnCreationFailure: platformAddress(),
        spends: [spend],
        changeAddress: owner,
        seed,
        coinType: COIN_TYPE,
        account: ACCOUNT,
        anchor,
        memo: 'shielded-memo-padded-to-32-bytes'
      })

      expect(stateTransition).toEqual(expect.any(StateTransitionWASM))
    }, 60000)
  })
})