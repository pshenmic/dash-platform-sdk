import * as DashHd from 'dashhd'
import {HDFromSeedOptions, HDWallet} from "dashhd";

export default async function seedToWalletKey(seed: Uint8Array, opts: HDFromSeedOptions | undefined = {versions: 'testnet'}): Promise<HDWallet> {
    return DashHd.fromSeed(seed, opts)
}