/**
 * **`bitcoin-tx` / `0xb1` codec**: Encodes an IPLD node representing a
 * Bitcoin transaction object into byte form.
 *
 * Note that a `bitcoin-tx` IPLD node can either be a full transaction with or
 * without SegWit data, or an intermediate transaction Merkle tree node; in
 * which case it is simply an array of two CIDs.
 *
 * @name BitcoinTransaction.encode()
 * @param {BitcoinTransaction|BitcoinTransactionMerkleNode} node
 * @returns {ByteView<BitcoinTransaction|BitcoinTransactionMerkleNode>}
 */
export function encode(node: BitcoinTransaction | BitcoinTransactionMerkleNode): ByteView<BitcoinTransaction | BitcoinTransactionMerkleNode>;
/**
 * Same as {@link BitcoinTransaction.encode()} but will explictly exclude any
 * witness (SegWit) data from the output. This is necessary for encoding SegWit
 * blocks since transactions must be stored both with and without witness data
 * to correctly represent the full content addressed structure.
 *
 * @name BitcoinTransaction.encodeNoWitness()
 * @param {BitcoinTransaction} node
 * @returns {ByteView<BitcoinTransaction>}
 */
export function encodeNoWitness(node: BitcoinTransaction): ByteView<BitcoinTransaction>;
/**
 * Encodes all transactions in a complete `BlockPorcelain` (see the
 * `bitcoin-block` npm package for details on this type) representation of an
 * entire Bitcoin transaction; including intermediate Merkle tree nodes.
 *
 * Intermediate Merkle tree nodes won't have the `transaction` property on the
 * output as they aren't full transactions and their `bytes` will have a length
 * of 64.
 *
 * @name BitcoinTransaction.encodeAll()
 * @param {BlockPorcelain} obj
 * @returns {IterableIterator<{cid:BitcoinTxCID, bytes:Uint8Array, transaction?:BitcoinBlockTransaction}>}
 */
export function encodeAll(obj: BlockPorcelain): IterableIterator<{
    cid: BitcoinTxCID;
    bytes: Uint8Array;
    transaction?: BitcoinBlockTransaction;
}>;
/**
 * Same as {@link BitcoinTransaction.encodeAll()} but only encodes non-SegWit
 * transaction data, that is, transactions without witness data and no secondary
 * SegWit transactions Merkle tree.
 *
 * @name BitcoinTransaction.encodeAllNoWitness()
 * @param {BlockPorcelain} obj
 * @returns {IterableIterator<{cid:BitcoinTxCID, bytes:Uint8Array, transaction?:BitcoinBlockTransaction}>}
 */
export function encodeAllNoWitness(obj: BlockPorcelain): IterableIterator<{
    cid: BitcoinTxCID;
    bytes: Uint8Array;
    transaction?: BitcoinBlockTransaction;
}>;
/**
 * **`bitcoin-block` / `0xb0` codec**: Decodes a bytes form of a Bitcoin
 * transaction into an IPLD node representation.
 *
 * Note that a `bitcoin-tx` IPLD node can either be a full transaction with or
 * without SegWit data, or an intermediate transaction Merkle tree node; in
 * which case it is simply an array of two CIDs. As byte form, an intermediate
 * Merkle tree node is a fixed 64-bytes.
 *
 * @name BitcoinTransaction.decode()
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
 * @returns {BitcoinTxCID} A CID (`multiformats.CID`) object representing this transaction identifier.
 * @name BitcoinTransaction.txHashToCID()
 */
export function txHashToCID(txHash: string): BitcoinTxCID;
/**
 * **`bitcoin-tx` / `0xb1` codec**: the codec name
 * @name BitcoinTransaction.name
 */
export const name: "bitcoin-tx";
/**
 * **`bitcoin-tx` / `0xb1` codec**: the codec name
 * @name BitcoinTransaction.name
 */
export const code: 177;
export type ByteView<T> = import('multiformats/codecs/interface').ByteView<T>;
export type TransactionPorcelain = import('bitcoin-block/interface').TransactionPorcelain;
export type BlockPorcelain = import('bitcoin-block/interface').BlockPorcelain;
export type BitcoinTransaction = import('./interface').BitcoinTransaction;
export type BitcoinTransactionMerkleNode = import('./interface').BitcoinTransactionMerkleNode;
export type BitcoinTxCID = import('./interface').BitcoinTxCID;
import { bytes } from "multiformats";
import { BitcoinTransaction as BitcoinBlockTransaction } from "bitcoin-block";
//# sourceMappingURL=bitcoin-tx.d.ts.map