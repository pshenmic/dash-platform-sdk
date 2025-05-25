import { HDKey, Versions } from 'dashhd'
import * as DashHD from 'dashhd'

export default async function keyToXPrivateKey (hdkey: HDKey, opts?: { version: Versions | number }): Promise<string> {
  return await DashHD.toXPrv(hdkey, opts)
}
