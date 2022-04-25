/**
 * @param {import('bitcoin-block/classes/Block').BlockPorcelain} deserialized
 * @param {CID|null} witnessMerkleRoot
 * @returns {{cid:CID, bytes:Uint8Array}|null}
 */
export function encodeWitnessCommitment(deserialized: import('bitcoin-block/classes/Block').BlockPorcelain, witnessMerkleRoot: CID | null): {
    cid: CID;
    bytes: Uint8Array;
} | null;
/**
 * @param {BitcoinWitnessCommitment} node
 * @returns {ByteView<BitcoinWitnessCommitment>}
 */
export function encode(node: BitcoinWitnessCommitment): ByteView<BitcoinWitnessCommitment>;
/**
 * @param {ByteView<BitcoinWitnessCommitment>} data
 * @returns {BitcoinWitnessCommitment}
 */
export function decode(data: ByteView<BitcoinWitnessCommitment>): BitcoinWitnessCommitment;
export const name: "bitcoin-witness-commitment";
export const code: 178;
export type ByteView<T> = import('multiformats/codecs/interface').ByteView<T>;
export type BlockPorcelain = import('bitcoin-block/classes/Block').BlockPorcelain;
export type BitcoinWitnessCommitment = import('./interface').BitcoinWitnessCommitment;
import { CID } from "multiformats";
//# sourceMappingURL=bitcoin-witness-commitment.d.ts.map