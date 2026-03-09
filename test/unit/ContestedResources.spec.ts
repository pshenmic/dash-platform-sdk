import { DataContractWASM, PrivateKeyWASM } from 'pshenmic-dpp'
import { DashPlatformSDK, ContestedStateResultType, ResourceVoteChoice } from '../../types.js'
import stringToIndexValueBytes from '../../src/utils/stringToIndexValueBytes.js'
import { LATEST_PLATFORM_VERSION } from '../../src/constants.js'

let sdk: DashPlatformSDK
let contract: DataContractWASM

describe('Contested Resources', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK({ network: 'testnet' })

    contract = new DataContractWASM(
      '11111111111111111111111111111111',
      BigInt(1),
      {
        domain: {
          type: 'object',
          indices: [
            {
              name: 'parentNameAndLabel',
              unique: true,
              contested: {
                resolution: 0,
                description: 'If the normalized label part of this index is less than 20 characters (all alphabet a-z, A-Z, 0, 1, and -) then a masternode vote contest takes place to give out the name',
                fieldMatches: [
                  {
                    field: 'normalizedLabel',
                    regexPattern: '^[a-zA-Z01-]{3,19}$'
                  }
                ]
              },
              properties: [
                {
                  normalizedParentDomainName: 'asc'
                },
                {
                  normalizedLabel: 'asc'
                }
              ]
            },
            {
              name: 'identityId',
              properties: [
                {
                  'records.identity': 'asc'
                }
              ],
              nullSearchable: false
            }
          ],
          $comment: "In order to register a domain you need to create a preorder. The preorder step is needed to prevent man-in-the-middle attacks. normalizedLabel + '.' + normalizedParentDomain must not be longer than 253 chars length as defined by RFC 1035. Domain documents are immutable: modification and deletion are restricted",
          required: [
            '$createdAt',
            '$updatedAt',
            '$transferredAt',
            'label',
            'normalizedLabel',
            'normalizedParentDomainName',
            'preorderSalt',
            'records',
            'subdomainRules'
          ],
          tradeMode: 1,
          transient: [
            'preorderSalt'
          ],
          properties: {
            label: {
              type: 'string',
              pattern: '^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$',
              position: 0,
              maxLength: 63,
              minLength: 3,
              description: "Domain label. e.g. 'Bob'."
            },
            records: {
              type: 'object',
              position: 5,
              properties: {
                identity: {
                  type: 'array',
                  maxItems: 32,
                  minItems: 32,
                  position: 1,
                  byteArray: true,
                  description: 'Identifier name record that refers to an Identity',
                  contentMediaType: 'application/x.dash.dpp.identifier'
                }
              },
              minProperties: 1,
              additionalProperties: false
            },
            preorderSalt: {
              type: 'array',
              maxItems: 32,
              minItems: 32,
              position: 4,
              byteArray: true,
              description: 'Salt used in the preorder document'
            },
            subdomainRules: {
              type: 'object',
              position: 6,
              required: [
                'allowSubdomains'
              ],
              properties: {
                allowSubdomains: {
                  type: 'boolean',
                  $comment: 'Only the domain owner is allowed to create subdomains for non top-level domains',
                  position: 0,
                  description: 'This option defines who can create subdomains: true - anyone; false - only the domain owner'
                }
              },
              description: 'Subdomain rules allow domain owners to define rules for subdomains',
              additionalProperties: false
            },
            normalizedLabel: {
              type: 'string',
              pattern: '^[a-hj-km-np-z0-9][a-hj-km-np-z0-9-]{0,61}[a-hj-km-np-z0-9]$',
              $comment: 'Must be equal to the label in lowercase. "o", "i" and "l" must be replaced with "0" and "1".',
              position: 1,
              maxLength: 63,
              description: "Domain label converted to lowercase for case-insensitive uniqueness validation. \"o\", \"i\" and \"l\" replaced with \"0\" and \"1\" to mitigate homograph attack. e.g. 'b0b'"
            },
            parentDomainName: {
              type: 'string',
              pattern: '^$|^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$',
              position: 2,
              maxLength: 63,
              minLength: 0,
              description: "A full parent domain name. e.g. 'dash'."
            },
            normalizedParentDomainName: {
              type: 'string',
              pattern: '^$|^[a-hj-km-np-z0-9][a-hj-km-np-z0-9-\\.]{0,61}[a-hj-km-np-z0-9]$',
              $comment: 'Must either be equal to an existing domain or empty to create a top level domain. "o", "i" and "l" must be replaced with "0" and "1". Only the data contract owner can create top level domains.',
              position: 3,
              maxLength: 63,
              minLength: 0,
              description: "A parent domain name in lowercase for case-insensitive uniqueness validation. \"o\", \"i\" and \"l\" replaced with \"0\" and \"1\" to mitigate homograph attack. e.g. 'dash'"
            }
          },
          canBeDeleted: true,
          transferable: 1,
          documentsMutable: false,
          additionalProperties: false
        },
        preorder: {
          type: 'object',
          indices: [
            {
              name: 'saltedHash',
              unique: true,
              properties: [
                {
                  saltedDomainHash: 'asc'
                }
              ]
            }
          ],
          $comment: 'Preorder documents are immutable: modification and deletion are restricted',
          required: [
            'saltedDomainHash'
          ],
          properties: {
            saltedDomainHash: {
              type: 'array',
              maxItems: 32,
              minItems: 32,
              position: 0,
              byteArray: true,
              description: 'Double sha-256 of the concatenation of a 32 byte random salt and a normalized domain name'
            }
          },
          canBeDeleted: true,
          documentsMutable: false,
          additionalProperties: false
        }
      },
      undefined,
      undefined,
      true,
      LATEST_PLATFORM_VERSION
    )

    contract.id = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
  })

  test('should be able to get contested resource vote state with finishedVoteInfo', async () => {
    const voteState = await sdk.contestedResources.getContestedResourceVoteState(
      contract,
      'domain',
      'parentNameAndLabel',
      [
        'dash',
        'asdmaye1ght'
      ].map(stringToIndexValueBytes),
      ContestedStateResultType.DOCUMENTS_AND_VOTE_TALLY,
      true
    )

    expect(voteState.finishedVoteInfo).toBeTruthy()
    expect(voteState.contenders).toBeTruthy()
    expect(voteState.contenders.length).toBeGreaterThan(0)
    expect(voteState.abstainVoteTally).toBeDefined()
    expect(voteState.lockVoteTally).toBeDefined()
    expect(voteState.skipped).toBeDefined()
  })

  test('should be able to get contested resource vote state for incorrect values', async () => {
    try {
      await sdk.contestedResources.getContestedResourceVoteState(
        contract,
        'domain',
        'parentNameAndLabel',
        [
          'dash',
          'agreatma1n'
        ].map(stringToIndexValueBytes),
        ContestedStateResultType.DOCUMENTS_AND_VOTE_TALLY,
        false
      )
    } catch (e) {
      expect(true).toBeTruthy()
      return
    }
    expect(false).toBeTruthy()
  })

  test('should be able to create TowardsIdentity vote', async () => {
    const dataContactId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
    const documentTypeName = 'domain'
    const indexName = 'parentNameAndLabel'
    const indexValues = ['dash', sdk.names.normalizeLabel('testidentity')]
    const proTxHash = 'd9b090cfc19caf2e27d512e69c43812a274bdf29c081d0ade4fd272ad56a5f89'
    const choice: ResourceVoteChoice = 'CKKYnVeKoxCbvuEhiT6MDoQaRyXgDECwtxoKL5cqucZE'
    const privateKey = PrivateKeyWASM.fromWIF('cPGCETHtoevguQoyTSdsowCEF91yqhrcikcvBNK2CuTwpSLV7m9Z')

    const voterIdentifier = await sdk.voting.createVoterIdentityId(proTxHash, privateKey.getPublicKeyHash())
    expect(voterIdentifier.base58()).toEqual('HqfLeB9PLg3t9CL25tRNkEDPjAnDaHAMmthRNe8ucn8q')
    const voterIdentity = await sdk.identities.getIdentityByIdentifier(voterIdentifier)

    const [identityPublicKey] = voterIdentity.getPublicKeys().filter(identityPublicKey => privateKey.getPublicKeyHash() === identityPublicKey.getPublicKeyHash())
    const identityNonce = await sdk.identities.getIdentityNonce(voterIdentity.id)

    const vote = sdk.voting.createVote(dataContactId, documentTypeName, indexName, indexValues, choice)
    const stateTransition = sdk.voting.createStateTransition(vote, proTxHash, voterIdentity.id, identityNonce + BigInt(1))

    // test key disabled
    identityPublicKey.removeDisabledAt()

    stateTransition.sign(privateKey, identityPublicKey)
  })

  test('should be able to create Abstain vote', async () => {
    const dataContactId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
    const documentTypeName = 'domain'
    const indexName = 'parentNameAndLabel'
    const indexValues = ['dash', sdk.names.normalizeLabel('testidentity')]
    const proTxHash = 'd9b090cfc19caf2e27d512e69c43812a274bdf29c081d0ade4fd272ad56a5f89'
    const choice: ResourceVoteChoice = 'abstain'
    const privateKey = PrivateKeyWASM.fromWIF('cPGCETHtoevguQoyTSdsowCEF91yqhrcikcvBNK2CuTwpSLV7m9Z')

    const voterIdentifier = await sdk.voting.createVoterIdentityId(proTxHash, privateKey.getPublicKeyHash())
    expect(voterIdentifier.base58()).toEqual('HqfLeB9PLg3t9CL25tRNkEDPjAnDaHAMmthRNe8ucn8q')
    const voterIdentity = await sdk.identities.getIdentityByIdentifier(voterIdentifier)

    const [identityPublicKey] = voterIdentity.getPublicKeys().filter(identityPublicKey => privateKey.getPublicKeyHash() === identityPublicKey.getPublicKeyHash())
    const identityNonce = await sdk.identities.getIdentityNonce(voterIdentity.id)

    const vote = sdk.voting.createVote(dataContactId, documentTypeName, indexName, indexValues, choice)
    const stateTransition = sdk.voting.createStateTransition(vote, proTxHash, voterIdentity.id, identityNonce + BigInt(1))

    // test key disabled
    identityPublicKey.removeDisabledAt()

    stateTransition.sign(privateKey, identityPublicKey)
  })

  test('should be able to create Lock vote', async () => {
    const dataContactId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
    const documentTypeName = 'domain'
    const indexName = 'parentNameAndLabel'
    const indexValues = ['dash', sdk.names.normalizeLabel('testidentity')]
    const proTxHash = 'd9b090cfc19caf2e27d512e69c43812a274bdf29c081d0ade4fd272ad56a5f89'
    const choice: ResourceVoteChoice = 'lock'
    const privateKey = PrivateKeyWASM.fromWIF('cPGCETHtoevguQoyTSdsowCEF91yqhrcikcvBNK2CuTwpSLV7m9Z')

    const voterIdentifier = await sdk.voting.createVoterIdentityId(proTxHash, privateKey.getPublicKeyHash())
    expect(voterIdentifier.base58()).toEqual('HqfLeB9PLg3t9CL25tRNkEDPjAnDaHAMmthRNe8ucn8q')
    const voterIdentity = await sdk.identities.getIdentityByIdentifier(voterIdentifier)

    const [identityPublicKey] = voterIdentity.getPublicKeys().filter(identityPublicKey => privateKey.getPublicKeyHash() === identityPublicKey.getPublicKeyHash())
    const identityNonce = await sdk.identities.getIdentityNonce(voterIdentity.id)

    const vote = sdk.voting.createVote(dataContactId, documentTypeName, indexName, indexValues, choice)
    const stateTransition = sdk.voting.createStateTransition(vote, proTxHash, voterIdentity.id, identityNonce + BigInt(1))

    // test key disabled
    identityPublicKey.removeDisabledAt()

    stateTransition.sign(privateKey, identityPublicKey)
  })
})
