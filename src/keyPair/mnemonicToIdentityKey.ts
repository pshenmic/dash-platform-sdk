import {HDFromSeedOptions, HDKey} from "dashhd";
import mnemonicToWalletKey from "./mnemonicToWalletKey";
import walletToIdentityKey from "./walletToIdentityKey";
import {walletToIdentityKeyOpts} from "../types";

export default async function mnemonicToIdentityKey(mnemonic: string, identityIndex: number | undefined = 0, keyIndex: number | undefined = 0, salt?: string, verify?: boolean, opts?: HDFromSeedOptions & walletToIdentityKeyOpts): Promise<HDKey> {
    const wallet = await mnemonicToWalletKey(mnemonic, salt, verify, opts)

    return walletToIdentityKey(wallet, identityIndex, keyIndex, opts)
}