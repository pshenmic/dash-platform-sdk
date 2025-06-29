import deriveChild from "./deriveChild";
import {HDFromSeedOptions, HDFromXKeyOptions, HDKey, HDWallet, Versions} from "dashhd";
import derivePath from "./derivePath";
import keyToXPublicKey from "./keyToXPublicKey";
import keyToWalletId from "./keyToWalletId";
import keyToXPrivateKey from "./keyToXPrivateKey";
import mnemonicToIdentityKey from "./mnemonicToIdentityKey";
import {WalletToIdentityKeyOpts} from "../types";
import mnemonicToSeed from "./mnemonicToSeed";
import mnemonicToWallet from "./mnemonicToWallet";
import privateKeyToWif from "./privateKeyToWif";
import publicKeyToAddress from "./publicKeyToAddress";
import seedToWallet from "./seedToWallet";
import walletToIdentityKey from "./walletToIdentityKey";
import xkeyToHDXKey from "./xkeyToHDXKey";

export class KeyPairController {
    deriveChild(parent: HDKey, index: number, hardened: boolean) {
        return deriveChild(parent, index, hardened)
    }

    derivePath(parent: HDKey, path: string) {
        return derivePath(parent, path)
    }

    keyToPublicKey(hdkey: HDKey, opts?: { version: Versions | number }) {
        return keyToXPublicKey(hdkey, opts)
    }

    keyToWalletId(key: HDKey) {
        return keyToWalletId(key)
    }

    keyToXPrivateKey(hdkey: HDKey, opts?: { version: Versions | number }) {
        return keyToXPrivateKey(hdkey, opts)
    }

    keyToXPublicKey(hdkey: HDKey, opts?: { version: Versions | number }) {
        return keyToXPublicKey(hdkey, opts)
    }

    mnemonicToIdentityKey(mnemonic: string, identityIndex: number | undefined = 0, keyIndex: number | undefined = 0, salt?: string, verify?: boolean, opts?: HDFromSeedOptions & WalletToIdentityKeyOpts) {
        return mnemonicToIdentityKey(mnemonic, identityIndex, keyIndex, salt, verify, opts)

    }

    mnemonicToSeed(mnemonic: string, salt?: string, verify?: boolean) {
        return mnemonicToSeed(mnemonic, salt, verify)

    }

    mnemonicToWallet(mnemonic: string, salt?: string, verify?: boolean, opts?: HDFromSeedOptions) {
        return mnemonicToWallet(mnemonic, salt, verify, opts)

    }

    privateKeyToWif(privateKeyBytes: Uint8Array, opts: { version: Versions | number } | undefined = { version: 'testnet' }) {
        return privateKeyToWif(privateKeyBytes, opts)
    }

    publicKeyToAddress(publicKeyBytes: Uint8Array,  opts?: { version: Versions | number }) {
        return publicKeyToAddress(publicKeyBytes, opts)

    }

    seedToWallet(seed: Uint8Array, opts: HDFromSeedOptions | undefined = { versions: 'testnet' }) {
        return seedToWallet(seed, opts)
    }

    walletToIdentityKey(wallet: HDWallet | HDKey, identityIndex: number, keyIndex: number, opts?: WalletToIdentityKeyOpts) {
        return walletToIdentityKey(wallet, identityIndex, keyIndex, opts)
    }

    xkeyToHDXKey(xkey: string, opts?: HDFromXKeyOptions) {
        return xkeyToHDXKey(xkey, opts)
    }

}
