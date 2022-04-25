/**
 * Encodes a full Bitcoin block, as presented in `BlockPorcelain` form (which is
 * available as JSON output from the `bitcoin-cli` tool—see the `bitcoin-block`
 * npm package for more information) into its constituent IPLD blocks. This
 * includes the header, the transaction merkle intermediate nodes, the
 * transactions and SegWit forms of the transaction merkle and nodes if present
 * along with the witness commitment block if required.
 *
 * @name Bitcoin.encodeAll()
 * @param {BlockPorcelain} block
 * @returns {IterableIterator<{cid: CID, bytes: Uint8Array}>}
 */
export function encodeAll(block: BlockPorcelain): IterableIterator<{
    cid: CID;
    bytes: Uint8Array;
}>;
/**
 * Given a CID for a `bitcoin-block` Bitcoin block header and an IPLD block
 * loader that can retrieve Bitcoin IPLD blocks by CID, re-assemble a full
 * Bitcoin block graph into both object and binary forms. This is the inverse
 * of the {@link Bitcoin.encodeAll()} function in that it puts the
 * `BitcoinPorcelain` back together. A JSON form of this output should match
 * the output provided by `bitcoin-cli` (with some possible minor differences).
 *
 * The loader should be able to return the binary form for `bitcoin-block`,
 * `bitcoin-tx` and `bitcoin-witness-commitment` CIDs.
 *
 * @param {IPLDLoader} loader an IPLD block loader function that takes a CID argument and returns a `Uint8Array` containing the binary block data for that CID
 * @param {CID} blockCid a CID of type `bitcoin-block` pointing to the Bitcoin block header for the block to be assembled
 * @returns {Promise<{deserialized:BlockPorcelain, bytes:Uint8Array}>} an object containing two properties, `deserialized` and `bytes` where `deserialized` contains a full JavaScript instantiation of the Bitcoin block graph and `bytes` contains a `Uint8Array` with the binary representation of the graph.
 * @name Bitcoin.assemble()
 */
export function assemble(loader: IPLDLoader, blockCid: CID): Promise<{
    deserialized: BlockPorcelain;
    bytes: Uint8Array;
}>;
export type BlockPorcelain = import('bitcoin-block/interface').BlockPorcelain;
export type TransactionPorcelain = import('bitcoin-block/interface').TransactionPorcelain;
export type IPLDLoader = import('./interface').IPLDLoader;
export type BitcoinTransaction = import('./interface').BitcoinTransaction;
export type BitcoinTransactionMerkleNode = import('./interface').BitcoinTransactionMerkleNode;
import { CID } from "multiformats";
import { bytes } from "multiformats";
//# sourceMappingURL=complete.d.ts.map