import { DashPlatformSDK } from '../../src/types'

let sdk: DashPlatformSDK

describe('Tokens', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
  })

  test('should be able to get token total supply', async () => {
    const tokenTotalSupply = await sdk.tokens.getTokenTotalSupply('5kRUF1SRTFtdskfaaQE9pCdADq8wyLFB1TNttnrBq3F8')

    expect(tokenTotalSupply.tokenId).toBeTruthy()
    expect(tokenTotalSupply.totalSystemAmount).toBeTruthy()
    expect(tokenTotalSupply.totalAggregatedAmountInUserAccounts).toBeTruthy()
  })

  test('should be able to get token contract info', async () => {
    const tokenContractInfo = await sdk.tokens.getTokenContractInfo('5kRUF1SRTFtdskfaaQE9pCdADq8wyLFB1TNttnrBq3F8')

    expect(tokenContractInfo.contractId.base58()).toEqual('CNvyZaBWofWPmgKYCBMF23h3cEhQfQHVY3wXCRkHEaau')
    expect(tokenContractInfo.tokenContractPosition).toEqual(0)
  })

  test('should be able to get identity tokens balances', async () => {
    const tokensIdentityBalance = await sdk.tokens.getIdentityTokensBalances('8GnWmaDGZe9HBchfWPeq2cRPM88c4BvAahCk9vxr34mg', ['5kRUF1SRTFtdskfaaQE9pCdADq8wyLFB1TNttnrBq3F8'])

    expect(tokensIdentityBalance.length).toEqual(1)
    expect(tokensIdentityBalance[0].tokenId).toBeTruthy()
    expect(tokensIdentityBalance[0].balance).toBeTruthy()
  })

  test('should be able to get token identities token balances', async () => {
    const tokensIdentityBalance = await sdk.tokens.getIdentitiesTokenBalances(['8GnWmaDGZe9HBchfWPeq2cRPM88c4BvAahCk9vxr34mg', 'ApGNc5xPfPqeJXMSVWgMqAyQu47a1BNGSf5ojtaqArbZ'], 'BPgPrZsiiotMcZpT4ZWxk1fJk2dy7Hfe9FDxANnVHS3Z')

    expect(tokensIdentityBalance.length).toEqual(2)
    expect(tokensIdentityBalance[0].identityId).toBeTruthy()
    expect(tokensIdentityBalance[0].balance).toBeTruthy()
  })
})
