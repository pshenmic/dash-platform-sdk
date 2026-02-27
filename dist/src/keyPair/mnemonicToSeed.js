import { mnemonicToSeedSync as func } from '@scure/bip39';
export default function mnemonicToSeed(mnemonic, salt) {
    return func(mnemonic, salt);
}
