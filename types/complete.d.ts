/**
 * @param {BlockPorcelain} block
 * @returns
 */
export function encodeAll(block: BlockPorcelain): Generator<{
    cid: CID;
    bytes: Uint8Array;
} | null, void, unknown>;
/**
 * Given a CID for a `bitcoin-block` Bitcoin block header and an IPLD block loader that can retrieve Bitcoin IPLD blocks by CID, re-assemble a full Bitcoin block graph into both object and binary forms.
 *
 * The loader should be able to return the binary form for `bitcoin-block`, `bitcoin-tx` and `bitcoin-witness-commitment` CIDs.
 *
 * @param {(cid:CID)=>Promise<Uint8Array>} loader an IPLD block loader function that takes a CID argument and returns a `Buffer` or `Uint8Array` containing the binary block data for that CID
 * @param {CID} blockCid a CID of type `bitcoin-block` pointing to the Bitcoin block header for the block to be assembled
 * @returns {Promise<{deserialized:BlockPorcelain, bytes:Uint8Array}>} an object containing two properties, `deserialized` and `bytes` where `deserialized` contains a full JavaScript instantiation of the Bitcoin block graph and `bytes` contains a `Uint8Array` with the binary representation of the graph.
 * @function
 */
export function assemble(loader: (cid: CID) => Promise<Uint8Array>, blockCid: CID): Promise<{
    deserialized: BlockPorcelain;
    bytes: Uint8Array;
}>;
export type BlockPorcelain = import('bitcoin-block/interface').BlockPorcelain;
export type TransactionPorcelain = import('bitcoin-block/interface').TransactionPorcelain;
export type BitcoinTransaction = import('./interface').BitcoinTransaction;
export type BitcoinTransactionMerkleNode = import('./interface').BitcoinTransactionMerkleNode;
import { CID } from "multiformats";
import { bytes } from "multiformats";
//# sourceMappingURL=complete.d.ts.map