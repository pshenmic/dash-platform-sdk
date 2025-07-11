import { HDFromXKeyOptions, HDXKey } from 'dashhd'
import * as DashHD from 'dashhd'

export default async function xkeyToHDXKey (xKey: string, opts?: HDFromXKeyOptions): Promise<HDXKey> {
  return await DashHD.fromXKey(xKey, opts)
}
