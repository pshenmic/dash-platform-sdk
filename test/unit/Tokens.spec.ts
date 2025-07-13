import { DashPlatformSDK } from '../../src/types'

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

    expect(tokenContractInfo.contractId.base58()).toEqual('Y189uedQG3CJCuu83P3DqnG7ngQaRKz69x3gY8uDzQe')
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
})
