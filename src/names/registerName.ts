import convertToHomographSafeChars from '../utils/convertToHomographSafeChars.js'
import { IdentityWASM, PrefundedVotingBalanceWASM, PrivateKeyWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import getRandomBytes from '../utils/getRandomBytes.js'
import sha256 from '../utils/sha256.js'
import createDocument from '../documents/create.js'
import createStateTransition from '../documents/createStateTransition.js'
import getIdentityContractNonce from '../identities/getIdentityContractNonce.js'
import broadcast from '../stateTransitions/broadcast.js'
import waitForStateTransitionResult from '../stateTransitions/waitForStateTransitionResult.js'
import testNameContested from './testNameContested.js'
import { DPNS_DATA_CONTRACT_ID } from '../constants.js'

export default async function registerName (grpcPool: GRPCConnectionPool, name: string, identity: IdentityWASM, privateKey: PrivateKeyWASM): Promise<void> {
  const [identityPublicKey] = identity.getPublicKeys().filter(identityPublicKey => identityPublicKey.getPublicKeyHash() === privateKey.getPublicKeyHash())

  if (identityPublicKey == null) {
    throw new Error('Private key does not match the identity')
  }

  if (identityPublicKey.securityLevel !== 'HIGH' && identityPublicKey.purpose !== 'AUTHENTICATION') {
    throw new Error('Wrong private key, must be from AUTHENTICATION HIGH identity public key')
  }

  const [label, parentDomainName] = name.split('.')

  const salt = getRandomBytes(32)

  const normalizedParentDomainName = convertToHomographSafeChars(parentDomainName)
  const normalizedLabel = convertToHomographSafeChars(label)

  const normalizedFullDomainName = `${normalizedLabel}.${normalizedParentDomainName}`

  const saltedDomainHash = await sha256(await sha256(
    new Uint8Array([
      ...salt,
      ...new TextEncoder().encode(normalizedFullDomainName)
    ])
  )) as Uint8Array

  let document
  let stateTransition

  // 1. Create preorder document
  const preorderData = {
    saltedDomainHash: Array.from(saltedDomainHash)
  }

  const identityContractNonce = await getIdentityContractNonce(grpcPool, identity.id, DPNS_DATA_CONTRACT_ID)

  document = createDocument(DPNS_DATA_CONTRACT_ID, 'preorder', preorderData, identity.id.base58())
  stateTransition = createStateTransition(document, 'create', { identityContractNonce: identityContractNonce + BigInt(1) })
  await stateTransition.sign(privateKey, identityPublicKey)

  await broadcast(grpcPool, stateTransition)

  // wait for state transition confirmation before next broadcast
  await waitForStateTransitionResult(grpcPool, stateTransition)

  // 2. Create domain document
  const domainData = {
    label,
    normalizedLabel,
    parentDomainName,
    normalizedParentDomainName,
    preorderSalt: Array.from(salt),
    records: {
      identity: Array.from(identity.id.bytes())
    },
    subdomainRules: {
      allowSubdomains: false
    }
  }

  document = createDocument(DPNS_DATA_CONTRACT_ID, 'domain', domainData, identity.id.base58())
  stateTransition = createStateTransition(document, 'create', {
    identityContractNonce: identityContractNonce + BigInt(2),
    // @ts-expect-error
    prefundedVotingBalance: testNameContested(normalizedLabel) ? new PrefundedVotingBalanceWASM('parentNameAndLabel', BigInt(20000000000)) : undefined
  })
  await stateTransition.sign(privateKey, identityPublicKey)

  await broadcast(grpcPool, stateTransition)
}
