import {Versions} from "dashhd";
import * as DashHD from "dashhd";

export default async function privateKeyToWif(privateKeyBytes: Uint8Array, opts: {
    version: Versions | number
} | undefined = {version: 'testnet'}): Promise<string> {
    return DashHD.toWif(privateKeyBytes, opts)
}