import {
  AgreedFeeMultiplierWASM,
  BatchTransitionWASM,
  DataContractWASM,
  DocumentActionFeeAgreementWASM,
  DocumentTransitionWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'

const DPNS = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const owner = 'QMfCRPcjXoTnZa9sA9JR2KWgGxZXMRJ4akgS3Uia1Qv'

// a document type that charges the contract owner 0.0001 Dash (10000000 credits) per created note
// and 0.00005 Dash per purchase. Fixed pricing charges the amounts as written, `feeMultiplier`
// pricing (the default) scales them by the epoch fee multiplier
function noteSchema (pricing: 'fixed' | 'feeMultiplier'): object {
  return {
    note: {
      type: 'object',
      properties: {
        message: { type: 'string', maxLength: 100, position: 0 }
      },
      additionalProperties: false,
      transferable: 1,
      tradeMode: 1,
      actionFees: {
        pricing,
        create: { owner: 10000000 },
        purchase: { owner: 5000000 }
      }
    }
  }
}

// reads the agreement a state transition carries
function agreementOf (stateTransition: StateTransitionWASM): DocumentActionFeeAgreementWASM | undefined {
  const [batched] = BatchTransitionWASM.fromStateTransition(stateTransition).transitions
  const transition = batched.toTransition() as DocumentTransitionWASM

  return transition.createTransition.base.actionFeeAgreement
}

let sdk: DashPlatformSDK
let fixedContract: DataContractWASM
let multipliedContract: DataContractWASM

describe('Document action fees', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet' })
    fixedContract = sdk.dataContracts.create(owner, 1n, noteSchema('fixed'))
    multipliedContract = sdk.dataContracts.create(owner, 2n, noteSchema('feeMultiplier'))
  })

  test('should be able to derive the agreement to a fixed fee', () => {
    // the fee multiplier of the current epoch (sdk.node.getEpochsInfo(1, false)), 1000 permille = x1
    const feeMultiplier = new AgreedFeeMultiplierWASM(1000n, 0)

    const agreement = DocumentActionFeeAgreementWASM.forDocumentTypeAction(fixedContract, 'note', 'Create', feeMultiplier)

    expect(agreement?.owner).toEqual(10000000n)
    expect(agreement?.moderators).toEqual(0n)
    // a fixed fee does not follow the multiplier, so the agreement names none
    expect(agreement?.pricing).toEqual('fixed')
    expect(agreement?.feeMultiplier).toEqual(undefined)
  })

  test('should be able to derive the agreement to a fee priced by the fee multiplier', () => {
    // accept the multiplier to grow by up to 20% before the transition executes
    const feeMultiplier = new AgreedFeeMultiplierWASM(1000n, 20)

    const agreement = DocumentActionFeeAgreementWASM.forDocumentTypeAction(multipliedContract, 'note', 'Purchase', feeMultiplier)

    expect(agreement?.owner).toEqual(5000000n)
    expect(agreement?.pricing).toEqual('feeMultiplier')
    expect(agreement?.feeMultiplier?.knownPermille).toEqual(1000n)
    expect(agreement?.feeMultiplier?.increaseTolerancePercent).toEqual(20)
  })

  test('should get no agreement for an action without a fee', () => {
    const feeMultiplier = new AgreedFeeMultiplierWASM(1000n, 0)

    expect(DocumentActionFeeAgreementWASM.forDocumentTypeAction(fixedContract, 'note', 'Delete', feeMultiplier)).toEqual(undefined)
  })

  test('should be able to check an agreement the way the network does', () => {
    const agreement = DocumentActionFeeAgreementWASM.forDocumentTypeAction(multipliedContract, 'note', 'Create', new AgreedFeeMultiplierWASM(1000n, 20)) as DocumentActionFeeAgreementWASM

    // the multiplier of the executing epoch may be up to 20% higher than the known one
    expect(agreement.verify(multipliedContract, 'note', 'Create', 1200n)).toEqual(true)
    expect(agreement.verify(multipliedContract, 'note', 'Create', 1201n)).toEqual(false)
    // the agreement must name the fee the document type declares for the action
    expect(agreement.verify(multipliedContract, 'note', 'Purchase', 1000n)).toEqual(false)
  })

  test('should be able to create a transition with an agreement', () => {
    const document = sdk.documents.create(fixedContract.id, 'note', { message: 'hello' }, owner, 1n)
    const feeMultiplier = new AgreedFeeMultiplierWASM(1000n, 0)
    const actionFeeAgreement = DocumentActionFeeAgreementWASM.forDocumentTypeAction(fixedContract, 'note', 'Create', feeMultiplier)

    const stateTransition = sdk.documents.createStateTransition(document, 'create', { identityContractNonce: 1n, actionFeeAgreement })

    expect(agreementOf(stateTransition)?.owner).toEqual(10000000n)
  })

  test('should be able to create a transition with an agreement as a plain object', () => {
    const document = sdk.documents.create(multipliedContract.id, 'note', { message: 'hello' }, owner, 1n)

    const stateTransition = sdk.documents.createStateTransition(document, 'create', {
      identityContractNonce: 1n,
      actionFeeAgreement: {
        owner: 10000000n,
        moderators: 0n,
        // omit for a fixed fee
        feeMultiplier: { knownPermille: 1000n, increaseTolerancePercent: 10 }
      }
    })

    const agreement = agreementOf(stateTransition)

    expect(agreement?.pricing).toEqual('feeMultiplier')
    expect(agreement?.feeMultiplier?.increaseTolerancePercent).toEqual(10)
  })

  test('should be able to get the agreement for a contract on the network', async () => {
    // reads the contract and the current epoch fee multiplier, DPNS declares no action fees
    const agreement = await sdk.documents.getActionFeeAgreement(DPNS, 'domain', 'create', 10)

    expect(agreement).toEqual(undefined)
  })
})
