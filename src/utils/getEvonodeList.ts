import { MasternodeList } from '../types'

export default async function getDAPINodeList (network: 'testnet' | 'mainnet'): Promise<MasternodeList> {
  const url = `https://${network === 'mainnet' ? '' : 'testnet.'}platform-explorer.pshenmic.dev/validators?isActive=true`

  const resp = await fetch(url)

  if (resp.status !== 200) {
    throw new Error('Failed to query Platform Explorer for active validators')
  }

  const { resultSet } = await resp.json()

  return resultSet
  // eslint-disable-next-line
    .map((validator: any) => validator?.proTxInfo?.state?.service ? `https://${validator.proTxInfo.state.service.split(':')[0] as string}${network === 'mainnet' ? '' : ':1443'}` : undefined)
    .filter(e => e != null)
}
