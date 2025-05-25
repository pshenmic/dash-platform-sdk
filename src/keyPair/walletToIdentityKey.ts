import {HDKey, HDWallet} from "dashhd";
import derivePath from "./derivePath";
import {walletToIdentityKeyOpts} from "../types";

export default async function walletToIdentityKey(wallet: HDWallet | HDKey, identityIndex: number, keyIndex: number, opts?: walletToIdentityKeyOpts): Promise<HDKey> {
    const network = opts?.network || 'testnet';

    const networkIndex = network === 'mainnet' ? 5 : 1

    let pathPostfix = `/5'/0'/0'/${identityIndex}'/${keyIndex}'`

    return derivePath(wallet, `m/9'/${networkIndex}'${pathPostfix}`)
}