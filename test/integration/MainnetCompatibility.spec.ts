import { DataContractWASM, DocumentWASM, IdentityWASM, IdentityPublicKeyWASM, KeyType, PlatformAddressWASM, StateTransitionWASM } from 'pshenmic-dpp'
import { DashPlatformSDK } from '../../src/DashPlatformSDK.js'
import { ContestedStateResultType, NodeStatus } from '../../types.js'
import stringToIndexValueBytes from '../../src/utils/stringToIndexValueBytes.js'

const mainnet = process.env.MAINNET_COMPATIBILITY === '1' ? describe : describe.skip
const dapiUrl = process.env.MAINNET_DAPI_URL ?? 'https://153.80.206.97:443'
const contractId = process.env.MAINNET_CONTRACT_ID ?? 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const documentType = process.env.MAINNET_DOCUMENT_TYPE ?? 'domain'
// Published Platform system contracts and a token observed in mainnet token-history transfers.
const dashpayContractId = 'Bwr4WHCPz5rFVAD87RqTs3izo4zpzwsEdKPWUT1NS1C7'
const documentHistoryId = '6voHRaoiPcfmMhbqCA9dixH98xcgPQ9UEcuaXjpVu3LD'
const tokenId = process.env.MAINNET_TOKEN_ID ?? 'DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd'
const transitionHex = process.env.MAINNET_STATE_TRANSITION_HEX

interface Outcome { method: string, status: string, detail?: string }

mainnet('Mainnet public SDK reads (explicit endpoint; no writes)', () => {
  let sdk: DashPlatformSDK
  let status: NodeStatus
  let documents: DocumentWASM[]
  let identities: IdentityWASM[]
  let fixtureError: Error | undefined
  const outcomes: Outcome[] = []
  const registered = new Set<string>()

  // Unsupported methods remain FAILED Jest tests, not successful compatibility assertions.
  const check = (method: string, run: () => Promise<void>, variant?: string): void => {
    registered.add(method)
    test(`${method}${variant != null ? `: ${variant}` : ''}`, async () => {
      try {
        await run()
        outcomes.push({ method: variant != null ? `${method} (${variant})` : method, status: 'PASS' })
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        const code = error != null && typeof error === 'object' && 'code' in error ? error.code : undefined
        const detail = decodeURIComponent(message)
        const outcome = code === 'UNIMPLEMENTED' || /not yet implemented|not implemented/.test(detail)
          ? 'UNSUPPORTED'
          : /PREPARATION:|non indexed property|indexOnly inner/.test(detail) ? 'FIXTURE LIMITATION' : 'FAIL'
        outcomes.push({ method, status: outcome, detail })
        throw error
      }
    })
  }

  beforeAll(async () => {
    sdk = new DashPlatformSDK({ network: 'mainnet', grpc: { dapiUrl } })
    status = await sdk.node.status()
    console.info('Mainnet target:', JSON.stringify({ endpoint: dapiUrl, version: status.version, chainId: status.network?.chainId, discoveryCovered: false }))
    expect(status.network?.chainId).toBe('evo1')
    expect(status.version?.software?.drive).toMatch(/^4\./)
    expect(status.chain?.catchingUp).toBe(false)
    try {
      // Fixture discovery uses public SDK methods, including their real proof verification.
      documents = await sdk.documents.query(contractId, documentType, undefined, undefined, 10)
      if (documents.length === 0) throw new Error('No documents; configure MAINNET_CONTRACT_ID and MAINNET_DOCUMENT_TYPE')
      const owners = process.env.MAINNET_IDENTITY_ID != null
        ? [process.env.MAINNET_IDENTITY_ID]
        : [...new Set(documents.map(document => document.ownerId.base58()))]
      identities = []
      for (const owner of owners) identities.push(await sdk.identities.getIdentityByIdentifier(owner))
      console.info('Verified SDK fixtures:', JSON.stringify({ contractId, documentType, tokenId, identityIds: identities.map(identity => identity.id.base58()) }))
    } catch (error) {
      fixtureError = new Error(`PREPARATION: SDK fixture discovery failed: ${String(error)}`)
    }
  }, 120000)

  afterAll(() => {
    for (const outcome of outcomes) {
      console.info(`${outcome.status} ${outcome.method}${outcome.detail != null ? `: ${decodeURIComponent(outcome.detail)}` : ''}`)
    }
    console.info('Scope: public SDK network reads only; no broadcasts, registration, signing or spending. Local builders/utilities are covered by unit tests. Default protocol-14 discovery is not covered.')
  })

  const fixture = (): IdentityWASM => {
    if (fixtureError != null) throw fixtureError
    return identities[0]
  }
  const keyFixture = (unique: boolean): IdentityPublicKeyWASM => {
    fixture()
    const key = identities.flatMap(identity => identity.getPublicKeys()).find(key => {
      const isUnique = key.keyTypeNumber === KeyType.ECDSA_SECP256K1 || key.keyTypeNumber === KeyType.BLS12_381
      return isUnique === unique && key.disabledAt == null
    })
    if (key == null) throw new Error(`PREPARATION: No ${unique ? 'unique' : 'non-unique'} key; set MAINNET_IDENTITY_ID`)
    return key
  }
  const address = async (): Promise<PlatformAddressWASM> => {
    if (process.env.MAINNET_ADDRESS != null) return PlatformAddressWASM.fromBech32m(process.env.MAINNET_ADDRESS)
    const { trunk } = await sdk.platformAddresses.getAddressesTrunkState()
    const entry = trunk.elements.find(entry => entry.element.type === 'ItemWithSumItem')
    if (entry == null) throw new Error('PREPARATION: No funded address in trunk; set MAINNET_ADDRESS')
    return PlatformAddressWASM.fromBytes(entry.key)
  }
  const recentHeight = (): bigint => BigInt(status.chain?.latestBlockHeight ?? '0') - 1n

  check('node.status', async () => {
    const result = await sdk.node.status()
    expect(result.network?.chainId).toBe('evo1')
    expect(result.version?.protocol?.drive?.current).toBeLessThan(14)
    expect(BigInt(result.chain?.latestBlockHeight ?? '0')).toBeGreaterThan(0n)
  })
  check('node.totalCredits', async () => { expect(await sdk.node.totalCredits()).toBeGreaterThan(0n) })
  check('node.getCurrentQuorumsInfo', async () => {
    const result = await sdk.node.getCurrentQuorumsInfo()
    expect(result.currentQuorumHash).toMatch(/^[0-9a-f]{64}$/)
    expect(result.validatorSets.length).toBeGreaterThan(0)
  })
  for (const ascending of [true, false]) {
    check('node.getEpochsInfo', async () => {
      const epoch = status.time?.epoch ?? -1
      expect(epoch).toBeGreaterThan(1)
      const result = await sdk.node.getEpochsInfo(2, ascending, ascending ? epoch - 1 : epoch)
      // The proof verifier returns epochs in ascending order for either query direction.
      expect(result.map(info => info.number)).toEqual([epoch - 1, epoch])
    }, ascending ? 'ascending' : 'descending')
  }
  check('node.getFinalizedEpochsInfo', async () => {
    const epoch = status.time?.epoch ?? -1
    expect(epoch).toBeGreaterThan(1)
    expect((await sdk.node.getFinalizedEpochsInfo(epoch - 1, true, epoch, false)).map(info => info.epochIndex)).toEqual([epoch - 1])
  })
  check('dataContracts.getDataContractByIdentifier', async () => {
    const result = await sdk.dataContracts.getDataContractByIdentifier(dashpayContractId)
    expect(result.id.base58()).toBe(dashpayContractId)
    expect(Object.keys(result.getSchemas()).length).toBeGreaterThan(0)
  }, 'on-chain DashPay, not cached DPNS')

  check('identities.getIdentityByIdentifier', async () => {
    const expected = fixture()
    const result = await sdk.identities.getIdentityByIdentifier(expected.id)
    expect(result.id.base58()).toBe(expected.id.base58())
    expect(result.getPublicKeys().length).toBeGreaterThan(0)
  })
  check('identities.getIdentityBalance', async () => { expect(await sdk.identities.getIdentityBalance(fixture().id)).toBeGreaterThanOrEqual(0n) })
  check('identities.getIdentityNonce', async () => { expect(await sdk.identities.getIdentityNonce(fixture().id)).toBeGreaterThanOrEqual(0n) })
  check('identities.getIdentityContractNonce', async () => { expect(await sdk.identities.getIdentityContractNonce(fixture().id, contractId)).toBeGreaterThanOrEqual(0n) })
  check('identities.getIdentityPublicKeys', async () => {
    const result = await sdk.identities.getIdentityPublicKeys(fixture().id)
    expect(result.map(key => key.keyId)).toEqual(expect.arrayContaining(fixture().getPublicKeys().map(key => key.keyId)))
  })
  check('identities.getIdentityPublicKeys', async () => {
    const key = fixture().getPublicKeys()[0]
    const result = await sdk.identities.getIdentityPublicKeys(fixture().id, [key.keyId])
    expect(result.map(key => key.keyId)).toEqual([key.keyId])
  }, 'specific key')
  check('identities.getIdentityByPublicKeyHash', async () => {
    const key = keyFixture(true)
    const expected = identities.find(identity => identity.getPublicKeys().some(candidate => candidate.data === key.data && candidate.keyTypeNumber === key.keyTypeNumber))
    expect(expected).toBeDefined()
    const result = await sdk.identities.getIdentityByPublicKeyHash(key.getPublicKeyHash())
    expect(result.id.base58()).toBe(expected?.id.base58())
  })
  check('identities.getIdentityByNonUniquePublicKeyHash', async () => {
    const hash = keyFixture(false).getPublicKeyHash()
    const result = await sdk.identities.getIdentityByNonUniquePublicKeyHash(hash)
    expect(result.getPublicKeys().some(key => key.getPublicKeyHash() === hash)).toBe(true)
    expect((await sdk.identities.getIdentityByIdentifier(result.id)).id.base58()).toBe(result.id.base58())
  })

  check('documents.query', async () => {
    const result = await sdk.documents.query(contractId, documentType, undefined, undefined, 10)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(document => document.dataContractId.base58() === contractId)).toBe(true)
  })
  for (const inclusive of [true, false]) {
    check('documents.query', async () => {
      fixture()
      const first = documents[0]
      const result = await sdk.documents.query(contractId, documentType, undefined, undefined, 2, inclusive ? first.id : undefined, inclusive ? undefined : first.id)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].id.base58()).toBe(documents[inclusive ? 0 : 1].id.base58())
    }, inclusive ? 'startAt' : 'startAfter')
  }
  check('documents.query', async () => {
    const result = await sdk.documents.query(contractId, documentType, [['normalizedParentDomainName', '==', 'dash'], ['normalizedLabel', 'in', ['dash', 'pshenmic']]], [['normalizedLabel', 'asc']], 5)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(document => ['dash', 'pshenmic'].includes(document.properties.normalizedLabel))).toBe(true)
  }, 'where and orderBy')
  check('documents.count', async () => {
    const result = await sdk.documents.count(documentHistoryId, { documentTypeName: 'transfer' })
    expect(result.entries.length).toBeGreaterThan(0)
    expect(result.entries[0].count).toBeGreaterThan(0n)
  })
  for (const method of ['sum', 'average'] as const) {
    check(`documents.${method}`, async () => {
      const result = await sdk.documents[method](documentHistoryId, { documentTypeName: 'priceUpdate', where: [['dataContractId', '==', contractId], ['$createdAt', '>', 0]] }, 'price')
      expect(result.entries.length).toBeGreaterThan(0)
      expect(typeof result.entries[0].sum).toBe('bigint')
      if (method === 'average') expect(typeof result.entries[0].count).toBe('bigint')
    })
  }
  check('documents.ranked', async () => {
    const result = await sdk.documents.ranked(documentHistoryId, { documentTypeName: 'transfer', select: { function: 'count' }, groupBy: ['dataContractId'], where: [['dataContractId', 'in', [contractId, documentHistoryId]]], orderBy: [['$count', 'desc']] })
    expect(Array.isArray(result.entries)).toBe(true)
  })
  check('documents.having', async () => {
    const result = await sdk.documents.having(documentHistoryId, { documentTypeName: 'transfer', select: { function: 'count' }, groupBy: ['dataContractId'], where: [['dataContractId', 'in', [contractId, documentHistoryId]]], having: [{ function: 'count', operator: '>=', value: 1 }], limit: 2 })
    expect(Array.isArray(result)).toBe(true)
  })
  check('documents.chained', async () => {
    const result = await sdk.documents.chained(contractId, { documentTypeName: documentType, where: [['normalizedParentDomainName', '==', 'dash']], limit: 2 }, 'records.identity', documentType)
    expect(Array.isArray(result.innerDocuments)).toBe(true)
    expect(Array.isArray(result.outerDocuments)).toBe(true)
  })
  check('documents.composite', async () => {
    const result = await sdk.documents.composite(documentHistoryId, { documentTypeName: 'transfer', where: [['dataContractId', '==', contractId]], orderBy: [['$createdAt', 'asc']], limit: 2 }, [{ documentTypeName: 'purchase', where: [['dataContractId', '==', contractId]], limit: 1, binding: { source: 'page', sourceProperty: 'documentId', field: 'documentId' } }])
    expect(result.pageDocuments.length).toBe(2)
    expect(result.subResults.length).toBe(1)
  })
  check('documents.getActionFeeAgreement', async () => {
    const result = await sdk.documents.getActionFeeAgreement(contractId, documentType, 'create')
    expect(result === undefined || typeof result === 'object').toBe(true)
  })

  check('names.searchByName', async () => {
    const [domain] = await sdk.documents.query(contractId, documentType, [['normalizedParentDomainName', '==', 'dash']], [['normalizedLabel', 'asc']], 1)
    if (domain == null) throw new Error('PREPARATION: No registered DPNS name')
    const result = await sdk.names.searchByName(`${String(domain.properties.label)}.dash`)
    expect(result.some(document => document.id.base58() === domain.id.base58())).toBe(true)
  })
  check('names.searchByIdentity', async () => {
    fixture()
    const domain = documents.find(document => document.properties.records?.identity != null)
    if (domain == null) throw new Error('PREPARATION: No DPNS identity record in fixtures')
    const result = await sdk.names.searchByIdentity(domain.properties.records.identity)
    expect(result.some(document => document.id.base58() === domain.id.base58())).toBe(true)
  })
  check('contestedResources.getContestedResourceVoteState', async () => {
    const contract: DataContractWASM = await sdk.dataContracts.getDataContractByIdentifier(contractId)
    const [domain] = await sdk.documents.query(contractId, documentType, [['normalizedParentDomainName', '==', 'dash']], [['normalizedLabel', 'asc']], 1)
    const label = process.env.MAINNET_CONTESTED_LABEL ?? domain?.properties.normalizedLabel
    if (typeof label !== 'string') throw new Error('PREPARATION: Set MAINNET_CONTESTED_LABEL to a mainnet contest')
    const result = await sdk.contestedResources.getContestedResourceVoteState(contract, documentType, 'parentNameAndLabel', ['dash', label].map(stringToIndexValueBytes), ContestedStateResultType.DOCUMENTS_AND_VOTE_TALLY, true, undefined, 10)
    expect(Array.isArray(result.contenders)).toBe(true)
    expect(typeof result.skipped).toBe('boolean')
  })

  check('tokens.getTokenContractInfo', async () => {
    const result = await sdk.tokens.getTokenContractInfo(tokenId)
    expect(result.dataContractId.bytes()).toHaveLength(32)
    expect(result.tokenContractPosition).toBeGreaterThanOrEqual(0)
  })
  check('tokens.getTokenTotalSupply', async () => {
    const result = await sdk.tokens.getTokenTotalSupply(tokenId)
    expect(result.tokenId.base58()).toBe(tokenId)
    expect(result.totalSystemAmount).toBeGreaterThanOrEqual(0n)
    expect(result.totalAggregatedAmountInUserAccounts).toBeGreaterThanOrEqual(0n)
  })
  check('tokens.getIdentityTokensBalances', async () => {
    const result = await sdk.tokens.getIdentityTokensBalances(fixture().id, [tokenId])
    expect(result).toHaveLength(1)
    expect(result[0].tokenId.base58()).toBe(tokenId)
    expect(result[0].balance == null || result[0].balance >= 0n).toBe(true)
  })
  check('tokens.getIdentitiesTokenBalances', async () => {
    const identity = fixture()
    const result = await sdk.tokens.getIdentitiesTokenBalances([identity.id], tokenId)
    expect(result).toHaveLength(1)
    expect(result[0].identityId.base58()).toBe(identity.id.base58())
    expect(result[0].balance == null || result[0].balance >= 0n).toBe(true)
  })
  check('tokens.getTokensDirectPurchasePrice', async () => {
    const result = await sdk.tokens.getTokensDirectPurchasePrice([process.env.MAINNET_PURCHASABLE_TOKEN_ID ?? tokenId])
    expect(Array.isArray(result)).toBe(true)
    for (const price of result) expect(price.tokenId.bytes()).toHaveLength(32)
  })
  check('tokens.createBaseTransition', async () => {
    const result = await sdk.tokens.createBaseTransition(tokenId, fixture().id)
    expect(result).toBeDefined()
  }, 'reads contract and nonce; builds locally, never broadcasts')

  check('platformAddresses.getAddressInfo', async () => {
    const expected = await address()
    const result = await sdk.platformAddresses.getAddressInfo(expected)
    expect(result.address.bytes()).toEqual(expected.bytes())
    expect(result.balance).toBeGreaterThanOrEqual(0n)
  })
  check('platformAddresses.getAddressesInfos', async () => {
    const result = await sdk.platformAddresses.getAddressesInfos([await address()])
    expect(result).toHaveLength(1)
    expect(result[0].balance).toBeGreaterThanOrEqual(0n)
  })
  check('platformAddresses.getAddressesTrunkState', async () => {
    const result = await sdk.platformAddresses.getAddressesTrunkState()
    expect(result.trunk.rootHash).toHaveLength(32)
    expect(BigInt(result.metadata.height)).toBeGreaterThan(0n)
  })
  check('platformAddresses.getAddressesBranchState', async () => {
    const { trunk, metadata } = await sdk.platformAddresses.getAddressesTrunkState()
    const leaf = trunk.leafKeys[0]
    if (leaf == null) throw new Error('PREPARATION: Address trunk has no branch fixture; branch method untested')
    const result = await sdk.platformAddresses.getAddressesBranchState(leaf.key, trunk.chunkDepths[0] + 1, BigInt(metadata.height), leaf.hash)
    expect(result.branchRootHash).toEqual(leaf.hash)
  })
  check('platformAddresses.getRecentAddressBalanceChanges', async () => {
    const result = await sdk.platformAddresses.getRecentAddressBalanceChanges(recentHeight())
    expect(Array.isArray(result)).toBe(true)
    for (const block of result) expect(block.blockHeight).toBeGreaterThanOrEqual(recentHeight())
  })
  check('platformAddresses.getRecentCompactedAddressBalanceChanges', async () => {
    const result = await sdk.platformAddresses.getRecentCompactedAddressBalanceChanges(recentHeight())
    expect(Array.isArray(result)).toBe(true)
    for (const range of result) expect(range.endBlockHeight).toBeGreaterThanOrEqual(range.startBlockHeight)
  })

  check('shielded.getShieldedEncryptedNotes', async () => {
    const result = await sdk.shielded.getShieldedEncryptedNotes(0n, 1)
    expect(Array.isArray(result)).toBe(true)
    for (const note of result) expect(note.cmx).toHaveLength(32)
  })
  check('shielded.getShieldedAnchors', async () => {
    const result = await sdk.shielded.getShieldedAnchors()
    expect(Array.isArray(result)).toBe(true)
    for (const anchor of result) expect(anchor).toHaveLength(32)
  })
  check('shielded.getMostRecentShieldedAnchor', async () => {
    const result = await sdk.shielded.getMostRecentShieldedAnchor()
    if (result != null) expect(result).toHaveLength(32)
  })
  check('shielded.getShieldedPoolState', async () => {
    const result = await sdk.shielded.getShieldedPoolState()
    if (result != null) expect(result).toBeGreaterThanOrEqual(0n)
  })
  check('shielded.getShieldedNotesCount', async () => {
    const result = await sdk.shielded.getShieldedNotesCount()
    if (result != null) expect(result).toBeGreaterThanOrEqual(0n)
  })
  check('shielded.getShieldedNullifiers', async () => {
    // Public absence query, not a wallet secret or spending operation.
    const nullifier = new Uint8Array(32)
    const result = await sdk.shielded.getShieldedNullifiers([nullifier])
    expect(result).toHaveLength(1)
    expect(result[0].nullifier).toEqual(nullifier)
    expect(typeof result[0].isSpent).toBe('boolean')
  })

  registered.add('stateTransitions.waitForStateTransitionResult')
  if (transitionHex != null) {
    check('stateTransitions.waitForStateTransitionResult', async () => {
      const result = await sdk.stateTransitions.waitForStateTransitionResult(StateTransitionWASM.fromHex(transitionHex))
      if (result != null) expect(result).toBeGreaterThanOrEqual(0n)
    })
  } else {
    test.skip('stateTransitions.waitForStateTransitionResult: UNTESTED, requires MAINNET_STATE_TRANSITION_HEX for an already executed transition', () => {})
    outcomes.push({ method: 'stateTransitions.waitForStateTransitionResult', status: 'UNTESTED', detail: 'No historical transition bytes; never submits a new transition' })
  }

  test('every public SDK network-read method has an explicit case', () => {
    const controllers = ['node', 'identities', 'dataContracts', 'documents', 'names', 'tokens', 'contestedResources', 'platformAddresses', 'shielded', 'stateTransitions'] as const
    const localOrWriteMethods = new Set([
      'create', 'createStateTransition', 'broadcast', 'registerName', 'testNameContested', 'normalizeLabel', 'validateName',
      'init', 'getShieldedBuilder', 'recoverNotes', 'buildSpendableNotes'
    ])
    const missing: string[] = []
    for (const controller of controllers) {
      for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(sdk[controller]))) {
        if (method === 'constructor' || localOrWriteMethods.has(method)) continue
        if (!registered.has(`${controller}.${method}`)) missing.push(`${controller}.${method}`)
      }
    }
    expect(missing).toEqual([])
  })
})
