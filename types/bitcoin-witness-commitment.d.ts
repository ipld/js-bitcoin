/**
 * @param {import('bitcoin-block/classes/Block').BlockPorcelain} deserialized
 * @param {BitcoinTxCID|null} witnessMerkleRoot
 * @returns {{cid:BitcoinWitnessCommitmentCID, bytes:Uint8Array}|null}
 * @ignore
 */
export function encodeWitnessCommitment(deserialized: import('bitcoin-block/classes/Block').BlockPorcelain, witnessMerkleRoot: BitcoinTxCID | null): {
    cid: BitcoinWitnessCommitmentCID;
    bytes: Uint8Array;
} | null;
/**
 * **`bitcoin-witness-commitment` / `0xb2` codec**: Encodes an IPLD node
 * representing a Bitcoin witness commitment object into byte form.
 *
 * The object is expected to be in the form
 * `{witnessMerkleRoot:CID, nonce:Uint8Array}` where the `witnessMerkleRoot`
 * may be null.
 *
 *
 * @name BitcoinWitnessCommitment.encode()
 * @param {BitcoinWitnessCommitment} node
 * @returns {ByteView<BitcoinWitnessCommitment>}
 */
export function encode(node: BitcoinWitnessCommitment): ByteView<BitcoinWitnessCommitment>;
/**
 * **`bitcoin-witness-commitment` / `0xb2` codec**: Decodes a bytes form of a
 * Bitcoin witness commitment into an IPLD node representation.
 *.
 *
 * The returned object will be in the form
 * `{witnessMerkleRoot:CID, nonce:Uint8Array}` where the `witnessMerkleRoot`
 * may be null.
 *
 * @name BitcoinWitnessCommitment.decode()
 * @param {ByteView<BitcoinWitnessCommitment>} data
 * @returns {BitcoinWitnessCommitment}
 */
export function decode(data: ByteView<BitcoinWitnessCommitment>): BitcoinWitnessCommitment;
/**
 * **`bitcoin-witness-commitment` / `0xb2` codec**: the codec name
 * @name BitcoinWitnessCommitment.name
 */
export const name: "bitcoin-witness-commitment";
/**
 * **`bitcoin-witness-commitment` / `0xb2` codec**: the codec code
 * @name BitcoinWitnessCommitment.code
 */
export const code: 178;
export type ByteView<T> = import('multiformats/codecs/interface').ByteView<T>;
export type BlockPorcelain = import('bitcoin-block/classes/Block').BlockPorcelain;
export type BitcoinWitnessCommitment = import('./interface').BitcoinWitnessCommitment;
export type BitcoinTxCID = import('./interface').BitcoinTxCID;
export type BitcoinWitnessCommitmentCID = import('./interface').BitcoinWitnessCommitmentCID;
//# sourceMappingURL=bitcoin-witness-commitment.d.ts.map