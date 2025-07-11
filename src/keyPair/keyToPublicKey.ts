import * as DashHD from 'dashhd'
import { HDKey } from 'dashhd'

export default async function keyToPublicKey (key: HDKey): Promise<HDKey> {
  return DashHD.toPublic(key)
}
