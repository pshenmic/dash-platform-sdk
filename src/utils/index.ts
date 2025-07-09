import convertToHomographSafeChars from './convertToHomographSafeChars'
import getEvonodeList from './getEvonodeList'
import { base58 } from '@scure/base'
import { MasternodeList } from '../types'
import getRandomArrayItem from './getRandomArrayItem'
import hexToBytes from './hexToBytes'
import bytesToHex from './bytesToHex'
import stringToIndexValueBytes from './stringToIndexValueBytes'
import indexValueBytesToString from './indexBytesToString'

export class UtilsController {
  base58ToBytes (str: string): Uint8Array<ArrayBufferLike> {
    return base58.decode(str)
  }

  bytesToBase58 (bytes: Uint8Array): string {
    return base58.encode(bytes)
  }

  bytesToHex (bytes: Uint8Array): string {
    return bytesToHex(bytes)
  }

  hexToBytes (hex: string): Uint8Array<ArrayBuffer> {
    return hexToBytes(hex)
  }

  convertToHomographSafeChars (str: string): string {
    return convertToHomographSafeChars(str)
  }

  stringToIndexBytes (value: string): Uint8Array<ArrayBufferLike> {
    return stringToIndexValueBytes(value)
  }

  indexValueBytesToString (value: Uint8Array<ArrayBufferLike>): string {
    return indexValueBytesToString(value)
  }

  async getEvonodeList (network: 'testnet' | 'mainnet'): Promise<MasternodeList> {
    return await getEvonodeList(network)
  }

  getRandomArrayItem (array: any[]): any {
    return getRandomArrayItem(array)
  }
}
