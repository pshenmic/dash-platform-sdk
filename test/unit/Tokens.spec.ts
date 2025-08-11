import { DashPlatformSDK } from '../../src/types'
import {
  BatchedTransitionWASM,
  BatchTransitionWASM, PrivateKeyWASM,
  TokenBaseTransitionWASM,
  TokenConfigurationWASM, TokenPricingScheduleWASM,
  TokenSetPriceForDirectPurchaseTransitionWASM, TokenTransitionWASM
} from 'pshenmic-dpp'

let sdk: DashPlatformSDK

describe('Tokens', () => {
  beforeAll(() => {
    sdk = new DashPlatformSDK()
  })

  test('should be able to set token direct price', async () => {
    const { contractId, tokenContractPosition } = await sdk.tokens.getTokenContractInfo('6niNoQpsT9zyVDJtXcbpV3tR3qEGi6BC6xoDdJyx1u7C')

    const owner = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'
    const dataContract = await sdk.dataContracts.getDataContractByIdentifier(contractId.base58())

    const identityContractNonce = await sdk.identities.getIdentityContractNonce(owner, dataContract.id.base58())
    const tokenId = TokenConfigurationWASM.calculateTokenId(dataContract.id.base58(), tokenContractPosition)
    const base = new TokenBaseTransitionWASM(identityContractNonce + BigInt(1), tokenContractPosition, dataContract.id.base58(), tokenId, undefined)
    const tokenSetPriceForDirectPurchaseTransitionWASM = new TokenSetPriceForDirectPurchaseTransitionWASM(base, TokenPricingScheduleWASM.SinglePrice(BigInt(10)), null)
    const tokenTransition = new TokenTransitionWASM(tokenSetPriceForDirectPurchaseTransitionWASM)
    const batchedTransition = new BatchedTransitionWASM(tokenTransition)
    const batch = BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition], owner, 1)

    const stateTransition = batch.toStateTransition()

    stateTransition.signByPrivateKey(PrivateKeyWASM.fromHex('c20acd0a04f838b267016243bed301286bc918de2a93d114a552285293c7ba66', 'testnet'), 'ECDSA_HASH160')
    stateTransition.signaturePublicKeyId = 5

    console.log(stateTransition.base64())
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
