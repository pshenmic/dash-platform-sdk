import { MasternodeList } from '../types'

export default async function getDAPINodeList (network: 'testnet' | 'mainnet'): Promise<MasternodeList> {
  const url = `https://${network === 'mainnet' ? '' : 'testnet.'}platform-explorer.pshenmic.dev/validators?isActive=true`

  const resp = await fetch(url)

  const {resultSet} = await resp.json()

  return resultSet
      .map(validator => validator?.proTxInfo?.state?.service? `https://${validator.proTxInfo.state.service.split(':')[0]}${network === 'mainnet' ? '' : ':1443'}` : undefined)
      .filter(e => !!e)
}
