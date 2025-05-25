import {Versions} from "dashhd";
import * as DashHD from "dashhd";

export default async function publicKeyToAddress(publicKeyBytes: Uint8Array, opts: {
    version: Versions | number
} | undefined = {version: 'testnet'}): Promise<string> {
    return DashHD.toAddr(publicKeyBytes, opts)
}