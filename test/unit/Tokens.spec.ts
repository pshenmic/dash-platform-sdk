import { DashPlatformSDK } from '../../src/types'
import { StateTransitionWASM, TokenBaseTransitionWASM, TokenEmergencyActionWASM } from 'pshenmic-dpp'

let sdk: DashPlatformSDK

describe('Tokens', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
  })

  test('should be able to get token total supply', async () => {
    const tokenTotalSupply = await sdk.tokens.getTokenTotalSupply('9YxdbQUjJmQsmVPen95HjAU3Esj7tVkWSY2EQWT84ZQP')

    expect(tokenTotalSupply.tokenId).toBeTruthy()
    expect(tokenTotalSupply.totalSystemAmount).toBeTruthy()
    expect(tokenTotalSupply.totalAggregatedAmountInUserAccounts).toBeTruthy()
  })

  test('should be able to get token contract info', async () => {
    const tokenContractInfo = await sdk.tokens.getTokenContractInfo('9YxdbQUjJmQsmVPen95HjAU3Esj7tVkWSY2EQWT84ZQP')

    expect(tokenContractInfo.dataContractId.base58()).toEqual('Y189uedQG3CJCuu83P3DqnG7ngQaRKz69x3gY8uDzQe')
    expect(tokenContractInfo.tokenContractPosition).toEqual(0)
  })

  test('should be able to get identity tokens balances', async () => {
    const tokensIdentityBalance = await sdk.tokens.getIdentityTokensBalances('8eTDkBhpQjHeqgbVeriwLeZr1tCa6yBGw76SckvD1cwc', ['9YxdbQUjJmQsmVPen95HjAU3Esj7tVkWSY2EQWT84ZQP'])

    expect(tokensIdentityBalance.length).toEqual(1)
    expect(tokensIdentityBalance[0].tokenId).toBeTruthy()
    expect(tokensIdentityBalance[0].balance).toBeTruthy()
  })

  test('should be able to get token identities token balances', async () => {
    const tokensIdentityBalance = await sdk.tokens.getIdentitiesTokenBalances(['8eTDkBhpQjHeqgbVeriwLeZr1tCa6yBGw76SckvD1cwc'], '9YxdbQUjJmQsmVPen95HjAU3Esj7tVkWSY2EQWT84ZQP')

    expect(tokensIdentityBalance.length).toEqual(1)
    expect(tokensIdentityBalance[0].identityId).toBeTruthy()
    expect(tokensIdentityBalance[0].balance).toBeTruthy()
  })

  test('should be able to create base token transition', async () => {
    const tokenBaseTransition = await sdk.tokens.createBaseTransition('A36eJF2kyYXwxCtJGsgbR3CTAscUFaNxZN19UqUfM1kw', '34vkjdeUTP2z798SiXqoB6EAuobh51kXYURqVa9xkujf')

    expect(tokenBaseTransition).toBeInstanceOf(TokenBaseTransitionWASM)
  })

  describe('create state transitions', () => {
    test('should be able to create burn transition', async () => {
      const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
      const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'

      const amount = BigInt(10)

      const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)

      const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'burn', { amount })

      expect(stateTransition).toBeInstanceOf(StateTransitionWASM)
    })

    test('should be able to create mint transition', async () => {
      const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
      const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'

      const recipientId = '8GopLQQCViyroS2gHktesGaCMe2tueXWeQ6Y9vpMFTEC'
      const amount = BigInt(10)

      const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)

      const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'mint', { identityId: recipientId, amount })

      expect(stateTransition).toBeInstanceOf(StateTransitionWASM)
    })

    test('should be able to create transfer transition', async () => {
      const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
      const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'

      const recipient = '8GopLQQCViyroS2gHktesGaCMe2tueXWeQ6Y9vpMFTEC'
      const amount = BigInt(100)

      const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)

      const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'transfer', { identityId: recipient, amount })

      expect(stateTransition).toBeInstanceOf(StateTransitionWASM)
    })

    test('should be able to create freeze transition', async () => {
      const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
      const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'

      const identityId = '8GopLQQCViyroS2gHktesGaCMe2tueXWeQ6Y9vpMFTEC'

      const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)

      const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'freeze', { identityId })

      expect(stateTransition).toBeInstanceOf(StateTransitionWASM)
    })

    test('should be able to create unfreeze transition', async () => {
      const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
      const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'

      const identityId = '8GopLQQCViyroS2gHktesGaCMe2tueXWeQ6Y9vpMFTEC'
      const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)

      const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'unfreeze', { identityId })

      expect(stateTransition).toBeInstanceOf(StateTransitionWASM)
    })

    test('should be able to create destroyFrozenFunds transition', async () => {
      const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
      const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'

      const identityId = '8GopLQQCViyroS2gHktesGaCMe2tueXWeQ6Y9vpMFTEC'

      const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)

      const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'destroyFrozenFunds', { identityId })

      expect(stateTransition).toBeInstanceOf(StateTransitionWASM)
    })

    test('should be able to create emergency action transition', async () => {
      const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
      const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'

      const emergencyAction = TokenEmergencyActionWASM.Pause

      const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)

      const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'emergencyAction', { emergencyAction })

      expect(stateTransition).toBeInstanceOf(StateTransitionWASM)
    })

    test('should be able to create setPriceForDirectPurchase transition', async () => {
      const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
      const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'

      const price = BigInt(10)
      const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)

      const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'setPriceForDirectPurchase', { price })

      expect(stateTransition).toBeInstanceOf(StateTransitionWASM)
    })

    test('should be able to create directPurchase transition', async () => {
      const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
      const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'

      const amount = BigInt(10)
      const totalAgreedPrice = BigInt(100)

      const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)

      const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'directPurchase', { amount, totalAgreedPrice })

      expect(stateTransition).toBeInstanceOf(StateTransitionWASM)
    })
  })
})
