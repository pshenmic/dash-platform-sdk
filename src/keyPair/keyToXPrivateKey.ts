import { HDKey } from 'dashhd'
import * as DashHD from 'dashhd'
import { NetworkVersion } from '../types'

export default async function keyToXPrivateKey (hdKey: HDKey, opts?: NetworkVersion): Promise<string> {
  return await DashHD.toXPrv(hdKey, opts)
}
