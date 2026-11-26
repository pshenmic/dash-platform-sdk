import {
  ContractBoundsWASM,
  dpp,
  IdentifierWASM,
  IdentityPublicKeyInCreationWASM,
  PlatformAddressWASM,
  SerializedActionWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import type { PlatformVersionWASM } from 'pshenmic-dpp'
import type { DashPlatformShielded, ShieldedBuilderWASM } from 'dash-platform-shielded'
import {
  IdentityCreateFromShieldedPoolParams,
  PrivateDocumentCreateFromShieldedPoolParams,
  ShieldFromAssetLockParams,
  ShieldParams,
  ShieldedTransferMultiParams,
  ShieldedTransferParams,
  ShieldedTransitionParamsMap,
  ShieldedTransitionType,
  ShieldedWithdrawalParams,
  UnshieldParams
} from '../../types.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

function memoBytes (memo?: string, paymentRef?: Uint8Array): Uint8Array {
  if (paymentRef != null) {
    if (memo != null && memo !== '') {
      throw new Error('memo and paymentRef are mutually exclusive')
    }

    // protocol v15 payment reference: a value the payee chose and gave to the payer
    return dpp.ShieldedMemoNAPI.fromPaymentRef(paymentRef).toBytes()
  }

  return memo == null || memo === ''
    ? dpp.ShieldedMemoNAPI.empty().toBytes()
    : dpp.ShieldedMemoNAPI.fromString(memo).toBytes()
}

function addressBytes (address: string | Uint8Array | { bytes: () => Uint8Array }): Uint8Array {
  if (address instanceof Uint8Array) {
    return address
  }

  if (typeof (address as any).bytes === 'function') {
    return (address as any).bytes()
  }

  return new PlatformAddressWASM(address as any).bytes()
}

function platformVersion (version?: PlatformVersionWASM): number {
  return version ?? LATEST_PLATFORM_VERSION
}

function identityPublicKeyBytes (key: IdentityCreateFromShieldedPoolParams['publicKeys'][number]): Uint8Array {
  const { id, purpose, securityLevel, keyType, readOnly, data, signature, contractBounds } = key

  return new IdentityPublicKeyInCreationWASM(
    id,
    purpose,
    securityLevel,
    keyType,
    readOnly,
    data,
    signature,
    contractBounds != null ? new ContractBoundsWASM(contractBounds.dataContractId, contractBounds.documentType) : undefined
  ).bytes()
}

export default async function createStateTransition<K extends ShieldedTransitionType> (
  shielded: DashPlatformShielded,
  builder: ShieldedBuilderWASM,
  type: K,
  params: ShieldedTransitionParamsMap[K]
): Promise<StateTransitionWASM> {
  switch (type) {
    case 'shield': {
      const p = params as ShieldParams

      return StateTransitionWASM.fromBytes(await builder.shield(
        p.recipient,
        p.shieldAmount,
        p.inputs.map(i => i.bytes()),
        p.privateKeys.map(k => k.bytes()),
        p.feeStrategy.map(s => s.bytes()),
        p.userFeeIncrease,
        memoBytes(p.memo, p.paymentRef),
        p.senderOvk,
        platformVersion(p.platformVersion)
      ))
    }

    case 'shieldFromAssetLock': {
      const p = params as ShieldFromAssetLockParams

      return StateTransitionWASM.fromBytes(await builder.shieldFromAssetLock(
        p.recipient,
        p.shieldAmount,
        p.assetLockProof.bytes(),
        p.privateKey.bytes(),
        memoBytes(p.memo, p.paymentRef),
        p.dummyOutputs,
        p.senderOvk,
        p.surplusOutput != null ? addressBytes(p.surplusOutput) : undefined,
        platformVersion(p.platformVersion)
      ))
    }

    case 'shieldedWithdrawal': {
      const p = params as ShieldedWithdrawalParams
      const result = await builder.shieldedWithdrawal(
        p.spends,
        p.withdrawalAmount,
        p.outputScript.bytes(),
        p.coreFeePerByte,
        p.pooling,
        p.changeAddress,
        p.seed,
        p.coinType,
        p.account,
        p.anchor,
        memoBytes(p.memo, p.paymentRef),
        platformVersion(p.platformVersion)
      )

      return StateTransitionWASM.fromBytes(result.stateTransition)
    }

    case 'unshield': {
      const p = params as UnshieldParams
      const result = await builder.unshield(
        p.spends,
        addressBytes(p.outputAddress),
        p.unshieldAmount,
        p.changeAddress,
        p.seed,
        p.coinType,
        p.account,
        p.anchor,
        memoBytes(p.memo, p.paymentRef),
        platformVersion(p.platformVersion)
      )

      return StateTransitionWASM.fromBytes(result.stateTransition)
    }

    case 'shieldedTransfer': {
      const p = params as ShieldedTransferParams
      const result = await builder.shieldedTransfer(
        p.spends,
        p.recipient,
        p.transferAmount,
        p.changeAddress,
        p.seed,
        p.coinType,
        p.account,
        p.anchor,
        memoBytes(p.memo, p.paymentRef),
        platformVersion(p.platformVersion)
      )

      return StateTransitionWASM.fromBytes(result.stateTransition)
    }

    case 'shieldedTransferMulti': {
      const p = params as ShieldedTransferMultiParams
      const result = await builder.shieldedTransferMulti(
        p.spends,
        p.outputs,
        p.changeAddress,
        p.seed,
        p.coinType,
        p.account,
        p.anchor,
        platformVersion(p.platformVersion)
      )

      return StateTransitionWASM.fromBytes(result.stateTransition)
    }

    case 'identityCreateFromShieldedPool': {
      const p = params as IdentityCreateFromShieldedPoolParams
      const result = await builder.identityCreateFromShieldedPool(
        p.publicKeys.map(identityPublicKeyBytes),
        p.privateKeys.map(k => k.bytes()),
        p.denomination,
        addressBytes(p.sendToAddressOnCreationFailure),
        p.spends,
        p.changeAddress,
        p.seed,
        p.coinType,
        p.account,
        p.anchor,
        memoBytes(p.memo, p.paymentRef),
        platformVersion(p.platformVersion)
      )

      const raw = new dpp.IdentityCreateFromShieldedPoolTransitionNAPI(
        result.publicKeys.map(bytes => IdentityPublicKeyInCreationWASM.fromBytes(bytes)._rawKeyInCreation),
        p.denomination.toString(),
        result.actions.map(bytes => SerializedActionWASM.fromBytes(bytes)._rawSerializedAction),
        result.anchor,
        result.proof,
        result.bindingsSignature,
        new PlatformAddressWASM(p.sendToAddressOnCreationFailure as any)._rawPlatformAddress,
        new IdentifierWASM(result.identityId)._rawIdentifier
      )

      return StateTransitionWASM.createFromRawInstance(raw.toStateTransition())
    }

    case 'privateDocumentCreateFromShieldedPool': {
      const p = params as PrivateDocumentCreateFromShieldedPoolParams
      const result = await builder.privateDocumentCreateFromShieldedPool(
        p.spends,
        new IdentifierWASM(p.dataContractId).bytes(),
        p.documentTypeName,
        p.entries,
        p.changeAddress,
        p.seed,
        p.coinType,
        p.account,
        p.anchor,
        platformVersion(p.platformVersion)
      )

      return StateTransitionWASM.fromBytes(result.stateTransition)
    }

    default:
      throw new Error(`Unimplemented shielded transition type: ${String(type)}`)
  }
}
