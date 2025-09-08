import convertToHomographSafeChars from '../utils/convertToHomographSafeChars.js'
import { IdentityWASM, PrivateKeyWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import getRandomBytes from '../utils/getRandomBytes.js'
import sha256 from '../utils/sha256.js'
import createDocument from '../documents/create.js'
import createStateTransition from '../documents/createStateTransition.js'
import getIdentityContractNonce from '../identities/getIdentityContractNonce.js'
import broadcast from '../stateTransitions/broadcast.js'
import sleep from '../utils/sleep.js'

const DPNS_DATA_CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

export default async function registerName (grpcPool: GRPCConnectionPool, name: string, identity: IdentityWASM, privateKey: PrivateKeyWASM, preorderSalt?: Uint8Array): Promise<void> {
  const [identityPublicKey] = identity.getPublicKeys().filter(identityPublicKey => identityPublicKey.getPublicKeyHash() === privateKey.getPublicKeyHash())

  if (identityPublicKey == null) {
    throw new Error('Private key does not match the identity')
  }

  if (identityPublicKey.securityLevel !== 'HIGH' && identityPublicKey.purpose !== 'AUTHENTICATION') {
    throw new Error('Wrong private key, must be from AUTHENTICATION HIGH identity public key')
  }

  const [label, parentDomainName] = name.split('.')

  const normalizedParentDomainName = convertToHomographSafeChars(parentDomainName)

  const salt = preorderSalt ?? getRandomBytes(32)

  const normalizedParentName = convertToHomographSafeChars(parentDomainName)
  const normalizedLabel = convertToHomographSafeChars(label)

  const normalizedFullDomainName = `${normalizedLabel}.${normalizedParentName}`

  const saltedDomainHash = sha256(sha256(
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

  // Emulate waitForStateTransitionResult todo replace with call
  await sleep(5000)

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
  stateTransition = createStateTransition(document, 'create', { identityContractNonce: identityContractNonce + BigInt(2) })
  await stateTransition.sign(privateKey, identityPublicKey)

  await broadcast(grpcPool, stateTransition)
}
