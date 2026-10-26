import convertToHomographSafeChars from '../utils/convertToHomographSafeChars.js'
import { IdentityWASM, PrefundedVotingBalanceWASM, PrivateKeyWASM } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import getRandomBytes from '../utils/getRandomBytes.js'
import sha256 from '../utils/sha256.js'
import createDocument from '../documents/create.js'
import createStateTransition from '../documents/createStateTransition.js'
import getIdentityContractNonce from '../identities/getIdentityContractNonce.js'
import broadcast from '../stateTransitions/broadcast.js'
import waitForStateTransitionResult from '../stateTransitions/waitForStateTransitionResult.js'
import testNameContested from './testNameContested.js'
import { DPNS_DATA_CONTRACT_ID } from '../constants.js'

export default async function registerName (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider, name: string, identity: IdentityWASM, privateKey: PrivateKeyWASM, preorderSalt?: Uint8Array): Promise<Uint8Array> {
  const [identityPublicKey] = identity.getPublicKeys().filter(identityPublicKey => identityPublicKey.getPublicKeyHash() === privateKey.getPublicKeyHash())

  if (identityPublicKey == null) {
    throw new Error('Private key does not match the identity')
  }

  if (identityPublicKey.securityLevel !== 'HIGH' && identityPublicKey.purpose !== 'AUTHENTICATION') {
    throw new Error('Wrong private key, must be from AUTHENTICATION HIGH identity public key')
  }

  if (preorderSalt != null && preorderSalt.length !== 32) {
    throw new Error('Preorder salt must be 32 bytes length')
  }

  const [label, parentDomainName] = name.split('.')

  const salt = preorderSalt ?? getRandomBytes(32)

  const normalizedParentDomainName = convertToHomographSafeChars(parentDomainName)
  const normalizedLabel = convertToHomographSafeChars(label)

  const normalizedFullDomainName = `${normalizedLabel}.${normalizedParentDomainName}`

  const saltedDomainHash = await sha256(await sha256(
    new Uint8Array([
      ...salt,
      ...new TextEncoder().encode(normalizedFullDomainName)
    ])
  )) as Uint8Array

  const identityContractNonce = await getIdentityContractNonce(grpcPool, quorumKeyProvider, identity.id, DPNS_DATA_CONTRACT_ID)

  // skip preorder if salt of existing preorder is provided
  const domainNonce = identityContractNonce + BigInt(preorderSalt == null ? 2 : 1)

  // salt is exposed in the error only once preorder exists (passed in or its broadcast accepted),
  // so registration can be retried with it without creating (and paying for) a new preorder
  let preorderSent = preorderSalt != null

  try {
    // 1. Create preorder document
    if (preorderSalt == null) {
      const preorderData = {
        saltedDomainHash
      }

      const preorderDocument = createDocument(DPNS_DATA_CONTRACT_ID, 'preorder', preorderData, identity.id.base58(), identityContractNonce + BigInt(1))
      const preorderStateTransition = createStateTransition(preorderDocument, 'create', { identityContractNonce: identityContractNonce + BigInt(1) })
      await preorderStateTransition.sign(privateKey, identityPublicKey)

      await broadcast(grpcPool, preorderStateTransition)
      preorderSent = true

      // wait for state transition confirmation before next broadcast
      await waitForStateTransitionResult(grpcPool, quorumKeyProvider, preorderStateTransition)
    }

    // 2. Create domain document
    const domainData = {
      label,
      normalizedLabel,
      parentDomainName,
      normalizedParentDomainName,
      preorderSalt: salt,
      records: {
        identity: identity.id.bytes()
      },
      subdomainRules: {
        allowSubdomains: false
      }
    }

    const domainDocument = createDocument(DPNS_DATA_CONTRACT_ID, 'domain', domainData, identity.id.base58(), domainNonce)
    const domainStateTransition = createStateTransition(domainDocument, 'create', {
      identityContractNonce: domainNonce,
      // @ts-expect-error
      prefundedVotingBalance: testNameContested(normalizedLabel) ? new PrefundedVotingBalanceWASM('parentNameAndLabel', BigInt(20000000000)) : undefined
    })
    await domainStateTransition.sign(privateKey, identityPublicKey)

    await broadcast(grpcPool, domainStateTransition)

    // wait for the domain too, so the next transition reads a nonce past it
    await waitForStateTransitionResult(grpcPool, quorumKeyProvider, domainStateTransition)
  } catch (e) {
    if (preorderSent && e instanceof Error) {
      Object.assign(e, { preorderSalt: salt })
    }

    throw e
  }

  return salt
}
