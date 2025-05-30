import { HDFromXKeyOptions, HDXKey } from 'dashhd'
import * as DashHD from 'dashhd'

export default async function xkeyToHDXKey (xkey: string, opts?: HDFromXKeyOptions): Promise<HDXKey> {
  return await DashHD.fromXKey(xkey, opts)
}
