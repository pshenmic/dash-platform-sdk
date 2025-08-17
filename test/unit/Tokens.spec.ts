import { DashPlatformSDK } from '../../src/types'
import { PrivateKeyWASM, StateTransitionWASM, TokenBaseTransitionWASM } from 'pshenmic-dpp'

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

  test('should be able to create transfer transition', async () => {
    const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'
    const recipient = '8GopLQQCViyroS2gHktesGaCMe2tueXWeQ6Y9vpMFTEC'
    const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
    const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)

    const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'transfer', { identityId: recipient, amount: BigInt(1000) })

    expect(stateTransition).toBeInstanceOf(StateTransitionWASM)
  })

  // test('should be able to create transfer transition', async () => {
  //   const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'
  //   const recipient = '8GopLQQCViyroS2gHktesGaCMe2tueXWeQ6Y9vpMFTEC'
  //   const tokenId = '6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C'
  //   const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenId, owner)
  //
  //   const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'transfer', { identityId: recipient, amount: BigInt(1000) })
  //
  //   stateTransition.signByPrivateKey(PrivateKeyWASM.fromHex('c20acd0a04f838b267016243bed301286bc918de2a93d114a552285293c7ba66', 'testnet'), 'ECDSA_SECP256K1')
  //   stateTransition.signaturePublicKeyId = 5
  //
  //   expect(stateTransition).toBeInstanceOf(StateTransitionWASM)
  //
  //   console.log(stateTransition.base64())
  // })
})
