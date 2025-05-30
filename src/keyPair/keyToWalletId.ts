import { HDKey } from 'dashhd'
import * as DashHD from 'dashhd'

export default async function keyToWalletId (key: HDKey): Promise<String> {
  return await DashHD.toId(key)
}
