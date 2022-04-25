/**
 * @param {BitcoinTransaction|BitcoinTransactionMerkleNode} node
 * @returns {ByteView<BitcoinTransaction|BitcoinTransactionMerkleNode>}
 */
export function encode(node: BitcoinTransaction | BitcoinTransactionMerkleNode): ByteView<BitcoinTransaction | BitcoinTransactionMerkleNode>;
/**
 * @param {BitcoinTransaction} node
 * @returns {ByteView<BitcoinTransaction>}
 */
export function encodeNoWitness(node: BitcoinTransaction): ByteView<BitcoinTransaction>;
/**
 * @param {BlockPorcelain} obj
 * @returns {IterableIterator<{cid:CID, bytes:Uint8Array, transaction?:BitcoinBlockTransaction}>}
 */
export function encodeAll(obj: BlockPorcelain): IterableIterator<{
    cid: CID;
    bytes: Uint8Array;
    transaction?: BitcoinBlockTransaction;
}>;
/**
 * @param {BlockPorcelain} obj
 * @returns {IterableIterator<{cid:CID, bytes:Uint8Array, transaction?:BitcoinBlockTransaction}>}
 */
export function encodeAllNoWitness(obj: BlockPorcelain): IterableIterator<{
    cid: CID;
    bytes: Uint8Array;
    transaction?: BitcoinBlockTransaction;
}>;
/**
 * @param {ByteView<BitcoinTransaction|BitcoinTransactionMerkleNode>} data
 * @returns {BitcoinTransaction|BitcoinTransactionMerkleNode}
 */
export function decode(data: ByteView<BitcoinTransaction | BitcoinTransactionMerkleNode>): BitcoinTransaction | BitcoinTransactionMerkleNode;
/**
 * Convert a Bitcoin transaction identifier (hash) to a CID. The identifier should be in big-endian form as typically understood by Bitcoin applications.
 *
 * The process of converting to a CID involves reversing the hash (to little-endian form), encoding as a `dbl-sha2-256` multihash and encoding as a `bitcoin-tx` multicodec. This process is reversable, see {@link cidToHash}.
 *
 * @param {string} txHash a string form of a transaction hash
 * @returns {CID} A CID (`multiformats.CID`) object representing this transaction identifier.
 */
export function txHashToCID(txHash: string): CID;
export const name: "bitcoin-tx";
export const code: 177;
export type ByteView<T> = import('multiformats/codecs/interface').ByteView<T>;
export type TransactionPorcelain = import('bitcoin-block/interface').TransactionPorcelain;
export type BlockPorcelain = import('bitcoin-block/interface').BlockPorcelain;
export type BitcoinTransaction = import('./interface').BitcoinTransaction;
export type BitcoinTransactionMerkleNode = import('./interface').BitcoinTransactionMerkleNode;
import { CID } from "multiformats";
import { bytes } from "multiformats";
import { BitcoinTransaction as BitcoinBlockTransaction } from "bitcoin-block";
//# sourceMappingURL=bitcoin-tx.d.ts.map